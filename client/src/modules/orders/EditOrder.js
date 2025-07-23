import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import {
    getOrderById,
    updateOrder,
    updateTable,
    getTables,
    addTicket,
    getUserById,
    updateTicket, getTicketByOrderId, addDishToOrder, getDishesByOrder, removeDishToOrder,
} from "./ordersService";
import {addDish, getCategories, getDishes} from "../dishes/dishesService";

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
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [ticketId, setTicketId] = useState(null);
    const [orderDishes, setOrderDishes] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [orderResponse, dishesResponse, categoriesResponse, orderDishesResponse] = await Promise.all([
                    getOrderById(pedidoId),
                    getDishes(),
                    getCategories(),
                    getDishesByOrder(pedidoId),
                ]);
                setOrder(orderResponse);
                setDishes(dishesResponse);
                setCategories(categoriesResponse);
                setSelectedCategory(categoriesResponse[0] || "");
                setOrderDishes(orderDishesResponse || []);
                console.log(orderDishesResponse);
                /*if (orderResponse.estado === 'cerrado'){
                    const ticketResponse = await getTicketByOrderId(orderResponse.data.id);
                    console.log(ticketResponse);
                    setTicketId(ticketResponse.data.id);
                    console.log(ticketResponse.data.paymentMethod);
                    setSelectedCurrency(ticketResponse.data.paymentMethod === "Efectivo" ? "Pesos" : "Bitcoin");
                }*/

            } catch (err) {
                console.log(err);
                setError("Error al cargar el pedido");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
        fetchOrderDishes()
    }, [pedidoId]);

    useEffect(() => {
        if (order) fetchOrderDishes();
    }, [order]);

    async function fetchOrderDishes() {
        try{
            const response = await getDishesByOrder(pedidoId);
        }
        catch (err) {
            console.error(err);
        }
        finally {

        }
    }


    const handleAddDish = async (dish) => {
        console.log("addDish", dish)
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
        const newDishes = (order.dishes || []).filter((item) => item.instanceId !== instanceId);
        setIsLoading(true);
        try {
            const response = await removeDishToOrder(pedidoId, instanceId);
            const  orderResponse = await getOrderById(pedidoId);
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
            if (newStatus === "cerrado") {
                setShowCurrencyDialog(true);
            } else {
                const response = await updateOrder(pedidoId, { estado: newStatus });
                setOrder(response.data);
                if (newStatus === "pagado") {
                    const tables = await getTables();
                    const table = tables.data.find((t) => t.pedidoId === Number(pedidoId));
                    if (table) {
                        await updateTable(table.id, { pedidoId: null, estado: "libre" });
                    }
                    navigate("/all-orders");
                }
            }
        } catch (err) {
            setError("Error al cambiar el estado del pedido");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmCurrency = async () => {
        if (!selectedCurrency) {
            setError("Por favor, selecciona una moneda");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const total = order.dishes?.reduce((sum, item) => sum + (item.dish?.precio || 0), 0) || 0;
            const userResponse = await getUserById(order.userId);
            const userName = userResponse.data?.name || "Desconocido";
            console.log(selectedCurrency);
            const ticket = {
                orderId: Number(pedidoId),
                date: new Date().toISOString().split("T")[0],
                amount: total,
                paymentMethod: selectedCurrency === "Pesos" ? "Efectivo" : "Bitcoin",
                userName,
            };
            const ticketResponse = await addTicket(ticket);
            setTicketId(ticketResponse.id);

            const response = await updateOrder(pedidoId, { estado: "cerrado" });
            setOrder(response.data);

            if (selectedCurrency === "Pesos") {
                console.log("Imprimiendo ticket en Pesos:", ticketResponse);
            } else {
                console.log("Preparando ticket con QR para Bitcoin:", ticketResponse);
                const qrCode = `bitcoin:payment?amount=${total}&orderId=${pedidoId}`;
                console.log("QR Code:", qrCode);
            }

            setShowCurrencyDialog(false);
            setSelectedCurrency(selectedCurrency);
        } catch (err) {
            setError("Error al cerrar el pedido");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayOrder = async () => {
        if (!selectedCurrency) {
            setError("No se ha seleccionado una moneda");
            return;
        }
        if (selectedCurrency === "Pesos") {
            setShowPaymentMethodDialog(true);
        } else {
            setIsLoading(true);
            setError("");
            try {
                const response = await updateOrder(pedidoId, {
                    estado: "pagado",
                    paymentMethod: "Bitcoin",
                });
                setOrder(response.data);

                const tables = await getTables();
                const table = tables.data.find((t) => t.pedidoId === Number(pedidoId));
                if (table) {
                    await updateTable(table.id, { pedidoId: null, estado: "libre" });
                }

                setTicketId(null);
                setSelectedCurrency("");
                navigate("/all-orders");
            } catch (err) {
                setError("Error al procesar el pago");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleConfirmPaymentMethod = async () => {
        if (!selectedPaymentMethod) {
            setError("Por favor, selecciona un método de pago");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            const response = await updateOrder(pedidoId, {
                estado: "pagado",
                paymentMethod: selectedPaymentMethod,
            });
            setOrder(response.data);

            await updateTicket(ticketId, { paymentMethod: selectedPaymentMethod });

            const tables = await getTables();
            const table = tables.data.find((t) => t.pedidoId === Number(pedidoId));
            if (table) {
                await updateTable(table.id, { pedidoId: null, estado: "libre" });
            }

            setShowPaymentMethodDialog(false);
            setSelectedPaymentMethod("");
            setTicketId(null);
            setSelectedCurrency("");
            navigate("/all-orders");
        } catch (err) {
            setError("Error al procesar el pago");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelDialog = () => {
        setShowCurrencyDialog(false);
        setShowPaymentMethodDialog(false);
        setSelectedPaymentMethod("");
    };

    const filteredDishes = dishes.filter((dish) => dish.category_id === selectedCategory.id);

    if (isLoading && !order) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
                            <p className="text-3xl font-bold">Cargando pedido...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error && !order) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
                            <p className="text-3xl font-bold text-red-600">{error}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }


    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center p-6">
                    <div className="h-full w-full bg-amber-100 rounded-lg flex flex-col p-6 gap-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-4xl font-bold">
                                Pedido #{pedidoId} - {order?.waiter || "Desconocido"}
                            </h2>
                            <span className="text-2xl font-bold">
                                Total: ${order?.total ? order.total.toFixed(2) : "0.00"}
                            </span>
                        </div>
                        {error && <p className="text-red-600 text-xl">{error}</p>}
                        <div className="flex flex-1 gap-6">
                            <div className="w-1/2 flex flex-col gap-4">
                                <h3 className="text-2xl font-semibold">Categorías</h3>
                                <div className="grid grid-cols-2 gap-4">
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
                                <h3 className="text-2xl font-semibold mt-4">Platillos Disponibles</h3>
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
                                                        {dishes.find(dish => dish.id === item.dish_id).name} - ${dishes.find(dish => dish.id === item.dish_id).price.toFixed(2)}
                                                    </span>
                                                    <button
                                                        className="bg-red-500 text-white py-2 px-4 text-lg rounded-lg hover:bg-red-600"
                                                        onClick={() => handleRemoveDish(item.id)}
                                                        disabled={isLoading}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xl text-gray-500">No hay platillos seleccionados.</p>
                                    )}
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <div className="flex gap-4">
                                        {order?.estado === "abierto" && (<>
                                            <button
                                                className="bg-blue-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-blue-600"
                                                onClick={() => handleChangeOrderStatus("cerrado")}
                                                disabled={isLoading}
                                            >
                                                Cerrar Pedido
                                            </button>
                                            <button
                                                    className="bg-yellow-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-yellow-600"
                                                    onClick={handleUndo}
                                                disabled={undoStack.length === 0 || isLoading}
                                            >
                                                Deshacer
                                            </button>
                                        </>)}
                                        {order?.estado === "cerrado" && (
                                            <>
                                                <button
                                                    className="bg-blue-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-blue-600"
                                                    onClick={() => handleChangeOrderStatus("abierto")}
                                                    disabled={isLoading}
                                                >
                                                    Reabrir Pedido
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
                                                    onClick={handlePayOrder}
                                                    disabled={isLoading || !selectedCurrency}
                                                >
                                                    Pagar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {showCurrencyDialog && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl p-6 w-[400px] flex flex-col gap-6">
                                            <h3 className="text-2xl font-bold text-center">Seleccionar Moneda</h3>
                                            <div className="flex flex-col gap-4">
                                                <button
                                                    className={`py-4 px-6 text-xl rounded-lg ${
                                                        selectedCurrency === "Pesos"
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                    }`}
                                                    onClick={() => setSelectedCurrency("Pesos")}
                                                >
                                                    💵 Pesos
                                                </button>
                                                <button
                                                    className={`py-4 px-6 text-xl rounded-lg ${
                                                        selectedCurrency === "Bitcoin"
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                    }`}
                                                    onClick={() => setSelectedCurrency("Bitcoin")}
                                                >
                                                    ₿ Bitcoin
                                                </button>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <button
                                                    className="bg-red-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-red-600"
                                                    onClick={handleCancelDialog}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-green-600"
                                                    onClick={handleConfirmCurrency}
                                                    disabled={!selectedCurrency || isLoading}
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showPaymentMethodDialog && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl p-6 w-[400px] flex flex-col gap-6">
                                            <h3 className="text-2xl font-bold text-center">Seleccionar Método de Pago</h3>
                                            <div className="flex flex-col gap-4">
                                                <button
                                                    className={`py-4 px-6 text-xl rounded-lg ${
                                                        selectedPaymentMethod === "Efectivo"
                                                            ? "bg-green-500 text-white"
                                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                    }`}
                                                    onClick={() => setSelectedPaymentMethod("Efectivo")}
                                                >
                                                    💵 Efectivo
                                                </button>
                                                <button
                                                    className={`py-4 px-6 text-xl rounded-lg ${
                                                        selectedPaymentMethod === "Tarjeta"
                                                            ? "bg-blue-500 text-white"
                                                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                                    }`}
                                                    onClick={() => setSelectedPaymentMethod("Tarjeta")}
                                                >
                                                    💳 Tarjeta
                                                </button>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <button
                                                    className="bg-red-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-red-600"
                                                    onClick={handleCancelDialog}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    className="bg-green-500 text-white py-4 px-8 text-xl rounded-lg hover:bg-green-600"
                                                    onClick={handleConfirmPaymentMethod}
                                                    disabled={!selectedPaymentMethod || isLoading}
                                                >
                                                    Confirmar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}