"use client";
import { use, useEffect, useState } from "react";
import {
  addDishToOrder,
  addPaymentToTicket,
  addTicket,
  createPayment,
  createTicket,
  getDishesByOrder,
  getOrderById,
  getPaymentCurrencies,
  getPaymentMethods,
  getTables,
  getUserById,
  removeDishToOrder,
  updateOrder,
  updateTable,
  updateTicket,
} from "./ordersService";
import { getCategories, getDishes } from "../dishes/dishesService";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import LoadingCard from "../../components/LoadingCard";
import BitcoinPriceService from "../../services/bitcoinPriceService";
import { apiClient } from "../../services/apiClient";
import { createInvoice } from "../cashier/cashierService";
import { QRCode } from "react-qr-code";
import { useRouter } from "next/navigation";
import {
  ChefHat,
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  CreditCard,
  Users,
  Utensils,
  Bitcoin,
  DollarSign,
  Receipt,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Spinner,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";
import { addToast } from "@heroui/react";

const priceService = new BitcoinPriceService();

export default function EditOrder({ dynamicParams, searchParams }) {
  const pedidoId = dynamicParams?.pedidoId;
  const router = useRouter();
  const isNew = searchParams?.isNew === "true";
  const [order, setOrder] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [generatedCashInfo, setGeneratedCashInfo] = useState(null);
  const [cashReceived, setCashReceived] = useState('');
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [showGenerateInvoiceDialog, setShowGenerateInvoiceDialog] =
    useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [ticketId, setTicketId] = useState(null);
  const [orderDishes, setOrderDishes] = useState([]);
  //const [generateInvoice, setGenerateInvoice] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentCurrencies, setPaymentCurrencies] = useState([]);

  const getPaymentIcon = (name) => {
    if (name.toLowerCase().includes("efectivo")) return "💵";
    if (name.toLowerCase().includes("crédito")) return "💳";
    if (name.toLowerCase().includes("débito")) return "🏧";
    if (name.toLowerCase().includes("btc")) return "₿";
    return "💰";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [
          orderResponse,
          dishesResponse,
          categoriesResponse,
          orderDishesResponse,
          paymentMethodsResponse,
          paymentCurrenciesResponse,
        ] = await Promise.all([
          getOrderById(pedidoId),
          getDishes(),
          getCategories(),
          getDishesByOrder(pedidoId),
          getPaymentMethods(),
          getPaymentCurrencies(),
        ]);
        setOrder(orderResponse);
        setDishes(dishesResponse);
        setCategories(categoriesResponse);
        setSelectedCategory(categoriesResponse[0] || "");
        setOrderDishes(orderDishesResponse || []);
        setPaymentMethods(paymentMethodsResponse);
        setPaymentCurrencies(paymentCurrenciesResponse);
        /*if (orderResponse.status === 'closed'){
                    const ticketResponse = await getTicketByOrderId(orderResponse.data.id);
                    console.log(ticketResponse);
                    setTicketId(ticketResponse.data.id);
                    console.log(ticketResponse.data.paymentMethod);
                    setSelectedCurrency(ticketResponse.data.paymentMethod === "Efectivo" ? "Pesos" : "Bitcoin");
                }*/
      } catch (err) {
        setError("Error al cargar el pedido");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
    fetchOrderDishes();
  }, [pedidoId]);

  useEffect(() => {
    if (order) fetchOrderDishes();
  }, [order]);

  async function fetchOrderDishes() {
    try {
      const response = await getDishesByOrder(pedidoId);
    } catch (err) {
      console.error(err);
    } finally {
    }
  }

  const handleAddDish = async (dish) => {
    if (order.status !== "open") return;
    setIsLoading(true);
    try {
      const response = await addDishToOrder(pedidoId, dish);
      //const response = await updateOrder(pedidoId, { dishes: newDishes });
      const orderResponse = await getOrderById(order.id);
      const dishesResponse = await getDishesByOrder(pedidoId);
      setOrderDishes(dishesResponse);
      setOrder(orderResponse);
    } catch (err) {
      setError("Error al agregar el platillo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDish = async (instanceId) => {
    const newDishes = (order.dishes || []).filter(
      (item) => item.instanceId !== instanceId,
    );
    setIsLoading(true);
    try {
      const response = await removeDishToOrder(pedidoId, instanceId);
      const orderResponse = await getOrderById(pedidoId);
      const orderDishesResponse = await getDishesByOrder(pedidoId);
      setOrderDishes(orderDishesResponse);
      setOrder(orderResponse);
    } catch (err) {
      setError("Error al eliminar el platillo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const previousDishes = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setIsLoading(true);
    try {
      const response = await updateOrder(pedidoId, { dishes: previousDishes });
      setOrder(response.data);
    } catch (err) {
      setError("Error al deshacer la acción");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeOrderStatus = async (newStatus) => {
    setIsLoading(true);
    setError("");
    try {
      order.status = newStatus;
      await updateOrder(order);
      const response = await getOrderById(pedidoId);
      setOrder(response);
      if (newStatus === "paid") {
        const tables = await getTables();
        const table = tables.find((t) => t.order_id === pedidoId);
        if (table) {
          await updateTable(table);
        }
        router.push("/all-orders");
      }
    } catch (err) {
      setError("Error al cambiar el estado del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPaymentMethod = async () => {
    if (!selectedPaymentMethod) {
      setError("Por favor, selecciona un método de pago ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const total = order.total;
      const currencyBase = await apiClient(`/base-currency`);
      console.log("Selected Currency ID:", currencyBase.currency_id);

      // Crear ticket
      const ticket = {
        order_id: order.id,
        user_id: order.user_id,
        ticket_date: Date.now().toString(),
        status: 1,
        total_amount: total,
        notes: "Sin Notas",
      };

      const ticketResponse = await createTicket(ticket);
      setTicketId(ticketResponse.id);

      // Crear payment
      const payment = {
        method_id: selectedPaymentMethod,
        currency_id: currencyBase.currency_id,
        transaction_id: "",
        amount: total,
      };

      const paymentResponse = await createPayment(payment);
      const paymentTicketResponse = await addPaymentToTicket(
        ticketResponse.id,
        paymentResponse.id,
      );

      const paymentMethodData = await apiClient(
        `/payments/methods/${selectedPaymentMethod}`,
      );
      console.log("Currency Data:", paymentMethodData);

      if (paymentMethodData.name === "Efectivo") {
        // Generar información para el pago en efectivo
        const cashInfo = {
          order_id: order.id,
          total_amount: total,
          currency: currencyBase.currency_id,
        };
        setGeneratedCashInfo(cashInfo);
        return;
      }

      if (paymentMethodData.name === "BTC") {
        const currencyBaseData = await apiClient(
          `/payments/currencies/${currencyBase.currency_id}`,
        );
        console.log("Currency Data:", currencyBaseData);

        // CONVERTIR A SATOSHIS
        const currencyAcronym = currencyBaseData.acronym.toLowerCase(); // ej: 'mxn', 'usd'
        console.log("Currency Acronym:", currencyAcronym);

        const priceConverted = await priceService.fiatToSatoshis(
          total,
          currencyAcronym,
        );

        console.log("Price in Satoshis:", priceConverted);

        const invoice = await createInvoice(priceConverted, order.id);

        console.log(invoice);
        setCreatedInvoice(invoice);

        console.log("Formatted:", priceService.formatSatoshis(priceConverted));
        setShowPaymentMethodDialog(false);
        return;
      }

      await handleChangeOrderStatus("paid");
      setShowPaymentMethodDialog(false);

      // OBTENER DATOS DE LA MONEDA
    } catch (err) {
      console.error("Error en handleConfirmPaymentMethod:", err);
      setError("Error al cerrar el pedido: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    // Lógica cuando el cliente pagó
    console.log("Cliente confirmó el pago");
    await handleChangeOrderStatus("paid");
    // Tu lógica aquí...
    setCreatedInvoice(null); // o lo que necesites hacer
  };

  const handlePaymentCancel = () => {
    // Lógica cuando el cliente no pagó
    console.log("Cliente no pagó");
    // Tu lógica aquí...
    setCreatedInvoice(null); // o lo que necesites hacer
  };

  const handleCancelDialog = () => {
    setShowCurrencyDialog(false);
    setShowPaymentMethodDialog(false);
    setSelectedPaymentMethod("");
  };

  const filteredDishes = dishes.filter(
    (dish) => dish.category_id === selectedCategory.id,
  );

  if (isLoading && !order) {
    return <LoadingCard message="Cargando pedido..." />;
  }

  if (error && !order) {
    return (
      <div className="min-h-screen gradient-fresh flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-red-600" />
            </div>
          </CardHeader>
          <CardBody className="text-center">
            <h2 className="text-xl font-bold text-deep mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              variant="outline"
              color="primary"
              onPress={() => router.push("/rooms")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Espacios
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleCurrencySelect = (currencyId) => {
    setSelectedCurrency(currencyId);
    setShowCurrencyDialog(false);
    setShowPaymentMethodDialog(true);
  };

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  return (
    <div className="min-h-screen gradient-fresh p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-lg border-0 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between w-full">
              <Button
                variant="ghost"
                onPress={() => router.push("/rooms")}
                className="text-forest hover:bg-mint/20"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Button>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-mint rounded-full flex items-center justify-center mb-2">
                  <Receipt className="w-6 h-6 text-forest" />
                </div>
                <h1 className="text-xl font-bold text-deep">
                  Pedido #{pedidoId.substring(0, 8)}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <Users className="w-3 h-3 mr-1" />
                    {order?.waiter || "Mesero"}
                  </div>
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    $ {order?.total ? order.total.toFixed(2) : "0.00"}
                  </div>
                </div>
              </div>
              <div className="w-20" />
            </div>
          </CardHeader>
        </Card>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardBody>
              <p className="text-red-600 text-center font-semibold">{error}</p>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel de Menú */}
          <div className="space-y-6">
            {/* Categorías */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <h3 className="text-lg font-bold text-deep flex items-center">
                  <Utensils className="w-5 h-5 mr-2" />
                  Categorías
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category ? "solid" : "outline"
                      }
                      color="primary"
                      size="lg"
                      onPress={() => setSelectedCategory(category)}
                      disabled={isLoading}
                      className={`h-16 ${selectedCategory === category ? "gradient-forest text-white" : ""}`}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Platillos */}
            {selectedCategory && (
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader>
                  <h3 className="text-lg font-bold text-deep">
                    Platillos - {selectedCategory.name}
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredDishes.map((dish) => (
                      <Card
                        key={dish.id}
                        className="border hover:shadow-md transition-shadow cursor-pointer"
                        isPressable
                        onPress={() => handleAddDish(dish)}
                      >
                        <CardBody className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-deep">
                              {dish.name}
                            </span>
                            <span className="text-forest text-sm">
                              ${dish.price.toFixed(2)}
                            </span>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
          {/* Panel de Pedido */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <h3 className="text-lg font-bold text-deep flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Platillos Seleccionados
                </h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {orderDishes.length > 0 ? (
                    orderDishes.map((item) => {
                      const dish = dishes.find((d) => d.id === item.dish_id);
                      return (
                        <Card
                          key={item.id}
                          className="border w-full"
                          isPressable
                          onPress={() => handleRemoveDish(item.id)}
                        >
                          <CardBody className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <span className="font-semibold text-deep">
                                  {dish?.name}
                                </span>
                                <div className="text-forest text-sm">
                                  ${dish?.price.toFixed(2)}
                                </div>
                              </div>
                              {order && order.status === "open" && (
                                <Minus className="w-4 h-4" />
                              )}
                            </div>
                          </CardBody>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        No hay platillos seleccionados
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Acciones */}
            <Card className="shadow-lg border-0 bg-white">
              <CardBody>
                <div className="space-y-4">
                  {order?.status === "open" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="ghost"
                        color="primary"
                        size="lg"
                        onPress={() => setShowPaymentMethodDialog(true)}
                        disabled={isLoading}
                        className="h-14"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Cerrar Pedido
                      </Button>
                      <Button
                        variant="bordered"
                        color="warning"
                        size="lg"
                        onPress={() => handleUndo()}
                        disabled={isLoading || undoStack.length === 0}
                        className="h-14"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Deshacer
                      </Button>
                    </div>
                  )}

                  {order?.status === "closed" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        color="primary"
                        size="lg"
                        onPress={() => handleChangeOrderStatus("open")}
                        disabled={isLoading}
                        className="h-14"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Reabrir Pedido
                      </Button>
                      <Button
                        variant="solid"
                        color="success"
                        size="lg"
                        onPress={() => setShowPaymentMethodDialog(true)}
                        disabled={isLoading}
                        className="gradient-forest text-white h-14"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Procesar Pago
                      </Button>
                    </div>
                  )}

                  {/* Status Badge */}
                  <Divider />
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                        order?.status === "open"
                          ? "bg-yellow-100 text-yellow-800"
                          : order?.status === "closed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      Estado:{" "}
                      {order?.status === "open"
                        ? "Abierto"
                        : order?.status === "closed"
                          ? "Cerrado"
                          : "Pagado"}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Modal de Método de Pago */}
        <ConfirmationPopup
          isOpen={showPaymentMethodDialog}
          title="Seleccionar Método de Pago"
          hideDefaultButtons={true}
          type="info"
          customBody={
            <div className="space-y-6">
              {/* Grid de métodos de pago */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    className={`group relative py-6 px-6 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                      selectedPaymentMethod === method.id
                        ? "border-green-500 bg-green-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-102"
                    }`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className={`text-3xl transition-transform group-hover:scale-110 ${
                          selectedPaymentMethod === method.id
                            ? "transform scale-110"
                            : ""
                        }`}
                      >
                        {getPaymentIcon(method.name)}
                      </div>
                      <span
                        className={`font-semibold text-lg ${
                          selectedPaymentMethod === method.id
                            ? "text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {method.name}
                      </span>
                    </div>

                    {/* Indicador de selección */}
                    {selectedPaymentMethod === method.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium touch-manipulation"
                  onClick={handleCancelDialog}
                >
                  Cancelar
                </button>
                <button
                  className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors font-medium touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed gradient-forest"
                  onClick={handleConfirmPaymentMethod}
                  disabled={!selectedPaymentMethod || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    "Confirmar Pago"
                  )}
                </button>
              </div>
            </div>
          }
          onClose={handleCancelDialog}
        />
        {/* Modal de Pago Efectivo */}
        {/* Modal de Pago Efectivo */}
{generatedCashInfo && (
  <ConfirmationPopup
    isOpen={!!generatedCashInfo}
    title="Pago en Efectivo"
    hideDefaultButtons={true}
    type="info"
    customBody={
      <div className="flex flex-col items-center space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💵</span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Ingresa el monto recibido en efectivo
          </h4>
          <p className="text-gray-600 text-sm">
            Calcularemos el cambio a devolver al cliente
          </p>
        </div>

        {/* Información del monto */}
        <div className="bg-gray-50 rounded-lg p-4 w-full text-center">
          <p className="text-sm text-gray-600">Monto total del pedido</p>
          <p className="text-2xl font-bold text-gray-800">
            ${order?.total?.toFixed(2) || "0.00"}
          </p>
        </div>

        {/* Input para el efectivo recibido */}
        <div className="w-full">
          <label className="block text-sm text-gray-600 mb-2">
            Efectivo recibido
          </label>
          <input
            type="text"
            value={cashReceived}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                setCashReceived(value);
              }
            }}
            placeholder="0.00"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
          />
          {cashReceived && (
            <p className="text-sm text-gray-600 mt-2">
              Cambio a devolver: <span className="font-bold">
                ${(cashReceived ? (parseFloat(cashReceived) - order.total).toFixed(2) : '0.00')}
              </span>
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 w-full pt-2">
          <button
            className="flex-1 py-4 px-6 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 active:bg-red-100 transition-all font-semibold touch-manipulation"
            onClick={handlePaymentCancel}
          >
            <div className="flex items-center justify-center gap-2">
              <span>❌</span>
              <span>Cancelar</span>
            </div>
          </button>
          <button
            className="flex-1 py-4 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 transition-all font-semibold touch-manipulation"
            onClick={() => {
              if (parseFloat(cashReceived) >= order.total) {
                alert(`Payment confirmed! Change to give: $${(parseFloat(cashReceived) - order.total).toFixed(2)}`);
                handlePaymentConfirm();
              } else {
                alert('Insufficient cash received!');
              }
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Confirmar Pago</span>
            </div>
          </button>
        </div>
      </div>
    }
    onClose={handleCancelDialog}
  />
)}

        {/* Modal de Pago Bitcoin */}
        {createdInvoice && (
          <ConfirmationPopup
            isOpen={!!createdInvoice}
            title="Pago con Bitcoin"
            hideDefaultButtons={true}
            type="info"
            customBody={
              <div className="flex flex-col items-center space-y-6">
                {/* Header con ícono */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bitcoin className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-deep mb-2">
                    Solicita al cliente que escanee el código QR
                  </h4>
                  <p className="text-gray-600 text-sm">
                    El cliente debe usar su billetera Bitcoin para completar el
                    pago
                  </p>
                </div>

                {/* QR Code con marco elegante */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <QRCode
                    value={createdInvoice?.serialized || ""}
                    size={220}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>

                {/* Información del monto */}
                <div className="bg-gray-50 rounded-lg p-4 w-full text-center">
                  <p className="text-sm text-gray-600">
                    Monto total del pedido
                  </p>
                  <p className="text-2xl font-bold text-deep">
                    ${order?.total?.toFixed(2) || "0.00"}
                  </p>
                </div>

                {/* Botones de acción mejorados */}
                <div className="flex gap-4 w-full pt-2">
                  <button
                    className="flex-1 py-4 px-6 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 active:bg-red-100 transition-all font-semibold touch-manipulation"
                    onClick={handlePaymentCancel}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>❌</span>
                      <span>No Pagó</span>
                    </div>
                  </button>
                  <button
                    className="flex-1 py-4 px-6 bg-green-500 text-white rounded-xl hover:bg-green-600 active:bg-green-700 transition-all font-semibold touch-manipulation gradient-forest"
                    onClick={handlePaymentConfirm}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirmar Pago</span>
                    </div>
                  </button>
                </div>
              </div>
            }
            onClose={handleCancelDialog}
          />
        )}
      </div>
    </div>
  );
}
