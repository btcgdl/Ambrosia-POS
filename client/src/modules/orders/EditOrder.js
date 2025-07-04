import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import {
    getOrderById,
    getDishes,
    getCategories,
    updateOrder,
    updateTable,
    getTables,
    addTicket,
    getUserById,
    updateTicket, getTicketByOrderId,
} from "./ordersService";
import { validatePin } from "../auth/authService";

export default function EditOrder() {
    const { pedidoId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isNew = searchParams.get("isNew") === "true";
    const [order, setOrder] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pin, setPin] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(isNew);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [undoStack, setUndoStack] = useState([]);
    const [showCurrencyDialog, setShowCurrencyDialog] = useState(false);
    const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [ticketId, setTicketId] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [orderResponse, dishesResponse, categoriesResponse] = await Promise.all([
                    getOrderById(pedidoId),
                    getDishes(),
                    getCategories(),
                ]);
                setOrder(orderResponse.data);
                setDishes(dishesResponse.data);
                setCategories(categoriesResponse.data);
                setSelectedCategory(categoriesResponse.data[0] || "");
                if (orderResponse.data.estado === 'cerrado'){
                    const ticketResponse = await getTicketByOrderId(orderResponse.data.id);
                    console.log(ticketResponse);
                    setTicketId(ticketResponse.data.id);
                    console.log(ticketResponse.data.paymentMethod);
                    setSelectedCurrency(ticketResponse.data.paymentMethod === "Efectivo" ? "Pesos" : "Bitcoin");
                }

            } catch (err) {
                console.log(err);
                setError("Error al cargar el pedido");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [pedidoId]);

    const handlePinSubmit = async () => {
        setError("");
        setIsLoading(true);
        try {
            const response = await validatePin(pin, pedidoId);
            if (response.authorized) {
                setIsAuthorized(true);
            } else {
                setError(response.error || "PIN inválido");
            }
        } catch (err) {
            setError("Error al validar el PIN");
        } finally {
            setIsLoading(false);
            setPin("");
        }
    };

    const handleAddDish = async (dish) => {
        if (order.estado !== "abierto") return;
        const instanceId = `${dish.id}_${Date.now()}`;
        const newDishes = [...(order.dishes || []), { instanceId, dish }];
        setUndoStack([...undoStack, order.dishes]);
        setIsLoading(true);
        try {
            const response = await updateOrder(pedidoId, { dishes: newDishes });
            setOrder(response.data);
        } catch (err) {
            setError("Error al agregar el platillo");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveDish = async (instanceId) => {
        const newDishes = (order.dishes || []).filter((item) => item.instanceId !== instanceId);
        setUndoStack([...undoStack, order.dishes]);
        setIsLoading(true);
        try {
            const response = await updateOrder(pedidoId, { dishes: newDishes });
            setOrder(response.data);
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
            const userName = userResponse.data?.nombre || "Desconocido";
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

    const filteredDishes = dishes.filter((dish) => dish.categoria === selectedCategory);

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

    if (!isAuthorized) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[80%] w-[80%] bg-amber-200 rounded-xl p-6 flex flex-col items-center justify-center gap-6">
                            <h2 className="text-3xl font-bold">Ingresar PIN</h2>
                            <div className="text-3xl font-bold mb-4">
                                <p>PIN Ingresado:</p>
                                <div>
                                    <span>{"*".repeat(pin.length)}</span>
                                </div>
                            </div>
                            {error && <p className="text-red-600 text-xl">{error}</p>}
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        className="bg-gray-800 text-white py-6 px-8 text-3xl rounded-lg hover:bg-gray-700"
                                        onClick={() => setPin((prev) => prev + num)}
                                        disabled={isLoading}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div className="col-span-3 flex justify-center">
                                    <button
                                        className="bg-gray-800 text-white py-6 px-8 text-3xl rounded-lg hover:bg-gray-700"
                                        onClick={() => setPin((prev) => prev + "0")}
                                        disabled={isLoading}
                                    >
                                        0
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-6 mt-6">
                                <button
                                    className="bg-red-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-red-600"
                                    onClick={() => setPin("")}
                                    disabled={isLoading}
                                >
                                    Borrar
                                </button>
                                <button
                                    onClick={handlePinSubmit}
                                    className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
                                    disabled={isLoading || pin.length < 4}
                                >
                                    Validar PIN
                                </button>
                            </div>
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
                                Pedido #{pedidoId} - {order?.mozo || "Desconocido"}
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
                                            key={category}
                                            className={`py-6 px-8 text-2xl rounded-lg ${
                                                selectedCategory === category
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                            }`}
                                            onClick={() => setSelectedCategory(category)}
                                            disabled={isLoading}
                                        >
                                            {category}
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
                                            <span className="font-bold">{dish.nombre}</span>
                                            <span>${dish.precio.toFixed(2)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="w-1/2 flex flex-col gap-4">
                                <h3 className="text-2xl font-semibold">Platillos Seleccionados</h3>
                                <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto max-h-[400px]">
                                    {order?.dishes?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {order.dishes.map((item) => (
                                                <li
                                                    key={item.instanceId}
                                                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                                                >
                                                    <span className="text-xl">
                                                        {item.dish.nombre} - ${item.dish.precio.toFixed(2)}
                                                    </span>
                                                    <button
                                                        className="bg-red-500 text-white py-2 px-4 text-lg rounded-lg hover:bg-red-600"
                                                        onClick={() => handleRemoveDish(item.instanceId)}
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