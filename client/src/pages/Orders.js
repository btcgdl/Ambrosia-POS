import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Orders() {
    const { orders, users, tables } = useMock();
    const navigate = useNavigate();
    const [filter, setFilter] = useState("en-curso"); // Filtro inicial: en-curso

    // Función para calcular el total de una orden
    const calculateTotal = (dishes) => {
        return dishes?.reduce((sum, item) => sum + item.dish.precio, 0) || 0;
    };

    // Función para obtener el nombre del mozo
    const getMozoName = (userId) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.nombre : "Desconocido";
    };

    // Función para obtener la mesa asignada
    const getTableName = (pedidoId) => {
        const table = tables.find((t) => t.pedidoId === pedidoId);
        return table ? table.nombre : "Sin mesa";
    };

    // Manejar clic en una orden
    const handleOrderClick = (pedidoId) => {
        navigate(`/modify-order/${pedidoId}`);
    };

    // Redirigir a la página de creación de pedido
    const handleCreateOrder = () => {
        navigate("/new-order");
    };

    // Filtrar pedidos según el filtro seleccionado
    const filteredOrders = orders.filter((order) => {
        if (filter === "en-curso") {
            return order.estado === "abierto" || order.estado === "cerrado";
        }
        return order.estado === "pagado";
    });

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[80%] w-[80%] bg-amber-200 rounded-lg p-6 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold">Lista de Órdenes</h2>
                            <button
                                className="w-16 h-16 bg-green-500 text-white text-3xl rounded-full flex items-center justify-center hover:bg-green-600"
                                onClick={handleCreateOrder}
                            >
                                +
                            </button>
                        </div>

                        {/* Botones de filtro */}
                        <div className="flex gap-4 mb-6">
                            <button
                                className={`py-4 px-8 text-2xl rounded-lg ${
                                    filter === "en-curso"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                                onClick={() => setFilter("en-curso")}
                            >
                                En curso
                            </button>
                            <button
                                className={`py-4 px-8 text-2xl rounded-lg ${
                                    filter === "pagados"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                                onClick={() => setFilter("pagados")}
                            >
                                Pagados
                            </button>
                        </div>

                        {/* Lista de órdenes */}
                        {filteredOrders.length > 0 ? (
                            <div className="overflow-y-auto max-h-[70%]">
                                <ul className="space-y-4">
                                    {filteredOrders.map((order) => (
                                        <li key={order.id}>
                                            <button
                                                className="w-full bg-white text-gray-800 py-4 px-6 rounded-lg hover:bg-gray-100 flex justify-between items-center text-xl"
                                                onClick={() => handleOrderClick(order.id)}
                                            >
                                                <span>Orden #{order.id}</span>
                                                <span>Estado: {order.estado}</span>
                                                <span>Total: ${calculateTotal(order.dishes).toFixed(2)}</span>
                                                <span>Mozo: {getMozoName(order.userId)}</span>
                                                <span>Mesa: {getTableName(order.id)}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="text-xl text-gray-500 text-center">
                                {filter === "en-curso"
                                    ? "No hay pedidos en curso."
                                    : "No hay pedidos pagados."}
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}