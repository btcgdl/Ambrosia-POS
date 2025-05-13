import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import InventoryNavBar from "../components/inventory/InventoryNavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Restocks() {
    const { restocks, addRestock, ingredients, suppliers } = useMock();
    const [formRestock, setFormRestock] = useState({ ingredientId: "", supplierId: "", quantity: "", totalCost: "" });

    const handleChangeRestock = (e) => {
        const { name, value } = e.target;
        setFormRestock((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitRestock = (e) => {
        e.preventDefault();
        addRestock({
            ingredientId: Number(formRestock.ingredientId),
            supplierId: Number(formRestock.supplierId),
            quantity: Number(formRestock.quantity),
            totalCost: Number(formRestock.totalCost),
        });
        setFormRestock({ ingredientId: "", supplierId: "", quantity: "", totalCost: "" });
    };

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full flex flex-col">
                <Header />
                <InventoryNavBar />
                <main className="h-[80%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Reabastecimientos</h2>
                        <form onSubmit={handleSubmitRestock} className="flex flex-col gap-4 w-full max-w-xl mb-6">
                            <select
                                name="ingredientId"
                                value={formRestock.ingredientId}
                                onChange={handleChangeRestock}
                                className="text-2xl p-3 rounded-lg"
                                required
                            >
                                <option value="">Seleccione ingrediente</option>
                                {ingredients.map((ing) => (
                                    <option key={ing.id} value={ing.id}>{ing.name}</option>
                                ))}
                            </select>
                            <select
                                name="supplierId"
                                value={formRestock.supplierId}
                                onChange={handleChangeRestock}
                                className="text-2xl p-3 rounded-lg"
                                required
                            >
                                <option value="">Seleccione proveedor</option>
                                {suppliers.map((sup) => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                            <input
                                name="quantity"
                                type="number"
                                step="0.01"
                                value={formRestock.quantity}
                                onChange={handleChangeRestock}
                                placeholder="Cantidad"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <input
                                name="totalCost"
                                type="number"
                                step="0.01"
                                value={formRestock.totalCost}
                                onChange={handleChangeRestock}
                                placeholder="Costo total"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                            >
                                Registrar Reabastecimiento
                            </button>
                        </form>
                        <div className="w-full max-w-4xl space-y-4">
                            {restocks.map((restock) => (
                                <div
                                    key={restock.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                >
                                    <div>
                                        <strong>{ingredients.find((ing) => ing.id === restock.ingredientId)?.name}</strong> – {restock.quantity} unidades, Proveedor: {suppliers.find((sup) => sup.id === restock.supplierId)?.name}, Costo: ${restock.totalCost}, Fecha: {restock.date}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}