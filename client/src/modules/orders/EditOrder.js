import { use, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import BitcoinPriceService from "../../services/bitcoinPriceService";
import { apiClient } from "../../services/apiClient";

const priceService = new BitcoinPriceService();

export default function EditOrder() {
  const { pedidoId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = searchParams.get("isNew") === "true";
  const [order, setOrder] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [undoStack, setUndoStack] = useState([]);
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
        navigate("/all-orders");
      }
    } catch (err) {
      setError("Error al cambiar el estado del pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPaymentMethod = async () => {
    if (!selectedPaymentMethod || !selectedCurrency) {
      setError("Por favor, selecciona un método de pago y una moneda");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const total = order.total;

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
        currency_id: selectedCurrency,
        transaction_id: "",
        amount: total,
      };

      const paymentResponse = await createPayment(payment);
      const paymentTicketResponse = await addPaymentToTicket(
        ticketResponse.id,
        paymentResponse.id,
      );

      await handleChangeOrderStatus("paid");
      setShowPaymentMethodDialog(false);

      // OBTENER DATOS DE LA MONEDA
      console.log("Selected Currency ID:", selectedCurrency);
      const currencyData = await apiClient(
        `/payments/currencies/${selectedCurrency}`,
      );
      console.log("Currency Data:", currencyData);

      // CONVERTIR A SATOSHIS
      const currencyAcronym = currencyData.acronym.toLowerCase(); // ej: 'mxn', 'usd'
      console.log("Currency Acronym:", currencyAcronym);

      const priceConverted = await priceService.fiatToSatoshis(
        total,
        currencyAcronym,
      );

      console.log("Price in Satoshis:", priceConverted);
      console.log("Formatted:", priceService.formatSatoshis(priceConverted));
    } catch (err) {
      console.error("Error en handleConfirmPaymentMethod:", err);
      setError("Error al cerrar el pedido: " + err.message);
    } finally {
      setIsLoading(false);
    }
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
    return (
      <main className="h-[90%] w-full flex items-center justify-center">
        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold">Cargando pedido...</p>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="h-[90%] w-full flex items-center justify-center">
        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
          <p className="text-3xl font-bold text-red-600">{error}</p>
        </div>
      </main>
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
    <main className="h-[90%] w-full flex items-center justify-center p-6">
      <div className="h-full w-full bg-amber-100 rounded-lg flex flex-col p-6 gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold">
            Pedido #{pedidoId.substring(0, 4)} -{" "}
            {order?.waiter || "Desconocido"}
          </h2>
          <span className="text-2xl font-bold">
            Total: ${order?.total ? order.total.toFixed(2) : "0.00"}
          </span>
        </div>
        {error && <p className="text-red-600 text-xl">{error}</p>}
        <div className="flex flex-1 gap-6 overflow-y-auto">
          <div className="w-1/2 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">Categorías</h3>
            <div className="grid grid-cols-2  gap-4 overflow-y-auto touch-pan-y">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`py-6 px-8 text-2xl rounded-lg ${
                    selectedCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  disabled={isLoading}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <h3 className="text-2xl font-semibold mt-4">
              Platillos Disponibles
            </h3>
            <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[300px] p-2">
              {filteredDishes.map((dish) => (
                <button
                  key={dish.id}
                  className="bg-green-100 text-gray-800 py-6 px-8 text-xl rounded-lg hover:bg-green-200 flex flex-col items-start"
                  onClick={() => handleAddDish(dish)}
                  disabled={isLoading}
                >
                  <span className="font-bold">{dish.name}</span>
                  <span>${dish.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">Platillos Seleccionados</h3>
            <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto max-h-[400px]">
              {orderDishes.length > 0 ? (
                <ul className="space-y-2">
                  {orderDishes.map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                    >
                      <span className="text-xl">
                        {dishes.find((dish) => dish.id === item.dish_id).name} -
                        $
                        {dishes
                          .find((dish) => dish.id === item.dish_id)
                          .price.toFixed(2)}
                      </span>
                      {order && order.status === "open" && (
                        <>
                          <button
                            className="bg-red-500 text-white py-2 px-4 text-lg rounded-lg hover:bg-red-600"
                            onClick={() => handleRemoveDish(item.id)}
                            disabled={isLoading}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xl text-gray-500">
                  No hay platillos seleccionados.
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-4">
                {order?.status === "open" && (
                  <>
                    <button
                      className="bg-blue-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-blue-600"
                      onClick={() => setShowCurrencyDialog(true)}
                      disabled={isLoading}
                    >
                      Cerrar Pedido
                    </button>
                  </>
                )}
                {order?.status === "closed" && (
                  <>
                    <button
                      className="bg-blue-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-blue-600"
                      onClick={() => handleChangeOrderStatus("open")}
                      disabled={isLoading}
                    >
                      Reabrir Pedido
                    </button>
                    <button
                      className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
                      onClick={() => setShowCurrencyDialog(true)}
                      disabled={isLoading}
                    >
                      Pagar
                    </button>
                  </>
                )}
              </div>
            </div>

            <ConfirmationPopup
              isOpen={showCurrencyDialog}
              title="Seleccionar Moneda"
              hideDefaultButtons={false}
              customBody={
                <div>
                  <div className="flex flex-col gap-4">
                    {paymentCurrencies.map((currency) => (
                      <button
                        key={currency.id}
                        className={`py-4 px-6 text-xl rounded-lg transition-colors touch-manipulation ${
                          selectedCurrency === currency.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
                        }`}
                        onClick={() => handleCurrencySelect(currency.id)}
                      >
                        {currency.acronym === "MXN" && "💵 "}
                        {currency.acronym === "USD" && "💲 "}
                        {currency.acronym === "BTC" && "₿ "}
                        {currency.acronym}
                      </button>
                    ))}
                  </div>
                </div>
              }
              onClose={handleCancelDialog}
            />

            <ConfirmationPopup
              isOpen={showPaymentMethodDialog}
              title="Seleccionar Método de Pago"
              hideDefaultButtons={true}
              customBody={
                <div>
                  <div className="flex flex-col gap-4">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        className={`py-4 px-6 text-xl rounded-lg flex items-center justify-center gap-2 transition-colors touch-manipulation ${
                          selectedPaymentMethod === method.id
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400"
                        }`}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                      >
                        <span>{getPaymentIcon(method.name)}</span>
                        <span>{method.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Botones personalizados */}
                  <div className="flex justify-between gap-4 mt-6 pt-4 border-t">
                    <button
                      className="bg-red-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation disabled:opacity-50"
                      onClick={handleCancelDialog}
                    >
                      Cancelar
                    </button>
                    <button
                      className="bg-green-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors touch-manipulation disabled:opacity-50"
                      onClick={handleConfirmPaymentMethod}
                      disabled={!selectedPaymentMethod || isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Cargando...</span>
                        </div>
                      ) : (
                        "Confirmar"
                      )}
                    </button>
                  </div>
                </div>
              }
              onClose={handleCancelDialog}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
