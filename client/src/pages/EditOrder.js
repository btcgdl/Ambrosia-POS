import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useMock } from "../contexts/MockSocketContext";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";

export default function EditOrder() {
    const { pedidoId } = useParams();
    const { users, orders, dishes, categories, tables, updateOrder, updateTable } = useMock();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [pin, setPin] = useState("");
    const [autorizado, setAutorizado] = useState(false);
    const [error, setError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(categories[0] || "");
    const [toastMessage, setToastMessage] = useState("");
    const [undoAction, setUndoAction] = useState(null);

    const pedido = orders.find((o) => o.id === Number(pedidoId));
    const mozoId = pedido?.userId;

    // Calcular el total del pedido
    const total = pedido?.dishes?.reduce((sum, item) => sum + item.dish.precio, 0) || 0;

    useEffect(() => {
        const isNew = searchParams.get("isNew") === "true";
        if (isNew) {
            setAutorizado(true);
            navigate(`/modify-order/${pedidoId}`, { replace: true });
        }
    }, [searchParams, navigate, pedidoId]);

    // Manejar el PIN
    const handleButtonClick = (num) => {
        if (pin.length < 4) {
            setPin((prevPin) => prevPin + num);
        }
    };

    const handleClear = () => {
        setPin(pin.slice(0, -1));
    };

    const handleValidarPin = () => {
        const user = users.find((u) => u.pin === Number(pin));
        if (!user) {
            setError("PIN incorrecto.");
            return;
        }

        const esAdmin = user.role === "admin";
        const esMozoAsignado = user.id === mozoId;

        if (esAdmin || esMozoAsignado) {
            setAutorizado(true);
            setError("");
        } else {
            setError("No tienes permisos para modificar este pedido.");
        }
    };

    // Mostrar mensaje temporal (toast)
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(""), 3000);
    };

    // Agregar platillo al pedido
    const handleAddDish = (dish) => {
        if (pedido.estado !== "abierto") {
            showToast("No se pueden agregar platillos a un pedido cerrado o pagado.");
            return;
        }
        const instanceId = `${dish.id}_${Date.now()}`; // Generar instanceId único
        const updatedDishes = [...(pedido.dishes || []), { instanceId, dish }];
        updateOrder({ ...pedido, dishes: updatedDishes });
        showToast(`Platillo "${dish.nombre}" agregado.`);
    };

    // Eliminar platillo del pedido
    const handleRemoveDish = (instanceId) => {
        if (pedido.estado !== "abierto") {
            showToast("No se pueden eliminar platillos de un pedido cerrado o pagado.");
            return;
        }
        const itemToRemove = pedido.dishes.find((item) => item.instanceId === instanceId);
        const updatedDishes = pedido.dishes.filter((item) => item.instanceId !== instanceId);
        updateOrder({ ...pedido, dishes: updatedDishes });
        showToast(`Platillo "${itemToRemove.dish.nombre}" eliminado.`);
        // Permitir deshacer
        setUndoAction({
            action: () => {
                updateOrder({ ...pedido, dishes: [...updatedDishes, itemToRemove] });
                showToast(`Platillo "${itemToRemove.dish.nombre}" restaurado.`);
                setUndoAction(null);
            },
            timeout: setTimeout(() => setUndoAction(null), 5000),
        });
    };

    // Cambiar estado del pedido y liberar mesa si es necesario
    const handleChangeOrderStatus = (newStatus) => {
        if (newStatus === "pagado" && pedido.estado !== "cerrado") {
            showToast("El pedido debe estar cerrado antes de marcarlo como pagado.");
            return;
        }
        if (newStatus === "abierto" && pedido.estado !== "cerrado") {
            showToast("Solo los pedidos cerrados pueden reabrirse.");
            return;
        }

        // Actualizar el estado del pedido
        updateOrder({ ...pedido, estado: newStatus });

        // Si el nuevo estado es pagado, liberar la mesa asignada
        if (newStatus === "pagado") {
            const assignedTable = tables.find((table) => table.pedidoId === Number(pedidoId));
            if (assignedTable) {
                updateTable({ ...assignedTable, pedidoId: null, estado: "libre" });
                showToast(`Pedido marcado como pagado. Mesa ${assignedTable.nombre} liberada.`);
            } else {
                showToast("Pedido marcado como pagado.");
            }
        } else {
            showToast(`Pedido marcado como ${newStatus}.`);
        }
    };

    // Filtrar platillos por categoría seleccionada
    const filteredDishes = dishes.filter((dish) => dish.categoria === selectedCategory);

    // UI para la pantalla de PIN
    if (!autorizado) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[80%] w-[80%] bg-amber-200 flex flex-col items-center justify-center p-6">
                            <h2 className="text-3xl font-bold mb-6">Ingresa tu PIN para modificar el pedido</h2>
                            <div className="text-4xl font-bold mb-6">
                                <p>PIN Ingresado:</p>
                                <div>
                                    <span>{"*".repeat(pin.length)}</span>
                                </div>
                            </div>

                            {error && <p className="text-red-600 text-2xl mb-4">{error}</p>}

                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <button
                                        key={num}
                                        className="bg-gray-800 text-white py-6 px-8 text-3xl rounded-lg hover:bg-gray-700"
                                        onClick={() => handleButtonClick(num)}
                                    >
                                        {num}
                                    </button>
                                ))}
                                <div className="col-span-3 flex justify-center">
                                    <button
                                        className="bg-gray-800 text-white py-6 px-8 text-3xl rounded-lg hover:bg-gray-700"
                                        onClick={() => handleButtonClick(0)}
                                    >
                                        0
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6">
                                <button
                                    className="bg-red-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-red-600"
                                    onClick={handleClear}
                                >
                                    Borrar
                                </button>
                                <button
                                    onClick={handleValidarPin}
                                    className="bg-green-500 text-white px-8 py-4 text-2xl rounded-lg hover:bg-green-600"
                                >
                                    Ingresar al pedido
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // UI para la edición del pedido
    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center p-6">
                    <div className="h-full w-full bg-amber-100 rounded-lg flex flex-col p-6 gap-6">
                        <h2 className="text-4xl font-bold text-center">Edición del Pedido #{pedidoId}</h2>

                        {/* Mensaje temporal (toast) */}
                        {toastMessage && (
                            <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg flex items-center gap-4">
                                <span>{toastMessage}</span>
                                {undoAction && (
                                    <button
                                        className="bg-white text-green-500 px-3 py-1 rounded hover:bg-gray-200"
                                        onClick={() => {
                                            undoAction.action();
                                            clearTimeout(undoAction.timeout);
                                        }}
                                    >
                                        Deshacer
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="flex flex-1 gap-6">
                            {/* Sección de categorías y platillos disponibles */}
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
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                <h3 className="text-2xl font-semibold mt-4">Platillos Disponibles</h3>
                                <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] p-2">
                                    {filteredDishes.map((dish) => (
                                        <button
                                            key={dish.id}
                                            className="bg-green-100 text-gray-800 py-6 px-8 text-xl rounded-lg hover:bg-green-200 flex flex-col items-start"
                                            onClick={() => handleAddDish(dish)}
                                            disabled={pedido.estado !== "abierto"}
                                        >
                                            <span className="font-bold">{dish.nombre}</span>
                                            <span>${dish.precio.toFixed(2)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sección de platillos del pedido y acciones */}
                            <div className="w-1/2 flex flex-col gap-4">
                                <h3 className="text-2xl font-semibold">Platillos en el Pedido</h3>
                                <div className="flex-1 bg-white rounded-lg p-4 overflow-y-auto max-h-[400px]">
                                    {pedido?.dishes?.length > 0 ? (
                                        <ul className="space-y-2">
                                            {pedido.dishes.map((item) => (
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
                                                        disabled={pedido.estado !== "abierto"}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xl text-gray-500">No hay platillos en el pedido.</p>
                                    )}
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold">Total: ${total.toFixed(2)}</span>
                                    <div className="flex flex-wrap gap-4">
                                        {pedido.estado === "abierto" && (
                                            <button
                                                className="bg-yellow-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-yellow-600"
                                                onClick={() => handleChangeOrderStatus("cerrado")}
                                            >
                                                Cerrar Pedido
                                            </button>
                                        )}
                                        {pedido.estado === "cerrado" && (
                                            <>
                                                <button
                                                    className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
                                                    onClick={() => handleChangeOrderStatus("pagado")}
                                                >
                                                    Marcar Pagado
                                                </button>
                                                <button
                                                    className="bg-gray-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-gray-600"
                                                    onClick={() => handleChangeOrderStatus("abierto")}
                                                >
                                                    Reabrir Pedido
                                                </button>
                                            </>
                                        )}
                                        {/* No mostrar botón de Reabrir Pedido si el estado es pagado */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}