import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMock } from "../contexts/MockSocketContext";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";

export default function CreateOrder() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    const { users, addOrder, assignOrderToTable } = useMock();

    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    const handleButtonClick = (num) => {
        if (pin.length < 4) {
            setPin((prevPin) => prevPin + num);
        }
    };

    const handleClear = () => {
        setPin(pin.slice(0, -1));
    };

    const handleCreateOrder = () => {
        const waiter = users.find((u) => u.pin === Number(pin));
        if (!waiter) {
            setError("PIN inválido. Intenta de nuevo.");
            return;
        }

        const newOrder = {
            id: Number(`${Date.now()}`),
            userId: waiter.id,
            dishes: [],
            estado: "abierto",
            createdAt: new Date().toISOString(),
        };

        addOrder(newOrder);
        if (tableId) {
            assignOrderToTable(Number(tableId), newOrder.id);
        }
        navigate(`/modify-order/${newOrder.id}?isNew=true`);
    };

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[80%] w-[80%] bg-amber-200 rounded-xl p-6 flex flex-col items-center justify-center gap-6">
                        <h2 className="text-3xl font-bold">Nuevo Pedido</h2>

                        {tableId && (
                            <p className="text-2xl">
                                Mesa asignada: <strong>{tableId}</strong>
                            </p>
                        )}

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
                                onClick={handleCreateOrder}
                                className="bg-green-500 text-white py-4 px-8 text-2xl rounded-lg hover:bg-green-600"
                            >
                                Crear Pedido
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}