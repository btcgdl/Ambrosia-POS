import { useState } from "react";
import InventoryNavBar from "../components/inventory/InventoryNavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Restocks() {
    const { restocks, addRestock, ingredients, suppliers } = useMock();
    const [formRestock, setFormRestock] = useState({
        supplierId: "",
        items: [{ ingredientId: "", quantity: "", cost: "" }],
    });
    const [selectedRestock, setSelectedRestock] = useState(null);

    const handleChangeSupplier = (e) => {
        const { value } = e.target;
        setFormRestock((prev) => ({
            ...prev,
            supplierId: value,
            items: [{ ingredientId: "", quantity: "", cost: "" }],
        }));
    };

    const handleChangeItem = (index, field, value) => {
        setFormRestock((prev) => {
            const newItems = [...prev.items];
            newItems[index] = { ...newItems[index], [field]: value };
            return { ...prev, items: newItems };
        });
    };

    const addItem = () => {
        setFormRestock((prev) => ({
            ...prev,
            items: [...prev.items, { ingredientId: "", quantity: "", cost: "" }],
        }));
    };

    const removeItem = (index) => {
        setFormRestock((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleSubmitRestock = (e) => {
        e.preventDefault();
        if (formRestock.supplierId && formRestock.items.length > 0) {
            // Validar que no haya ingredientes duplicados
            const ingredientIds = formRestock.items.map((item) => item.ingredientId);
            if (new Set(ingredientIds).size !== ingredientIds.length) {
                alert("No se pueden incluir ingredientes duplicados en el reabastecimiento.");
                return;
            }
            // Calcular totalCost
            const totalCost = formRestock.items.reduce(
                (sum, item) => sum + (Number(item.cost) || 0),
                0
            );
            // Filtrar ítems válidos
            const validItems = formRestock.items.filter(
                (item) => item.ingredientId && item.quantity && item.cost
            ).map((item) => ({
                ingredientId: Number(item.ingredientId),
                quantity: Number(item.quantity),
                cost: Number(item.cost),
            }));
            if (validItems.length > 0) {
                addRestock({
                    supplierId: Number(formRestock.supplierId),
                    items: validItems,
                    totalCost,
                });
                setFormRestock({
                    supplierId: "",
                    items: [{ ingredientId: "", quantity: "", cost: "" }],
                });
            }
        }
    };

    const supplier = suppliers.find((sup) => sup.id === Number(formRestock.supplierId));
    const availableIngredients = supplier
        ? ingredients.filter((ing) => supplier.ingredientIds.includes(ing.id))
        : [];

    return (
        <div className="flex w-screen h-screen">
            <InventoryNavBar />
            <div className="w-[75%] h-full flex flex-col">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Reabastecimientos</h2>
                        <form onSubmit={handleSubmitRestock} className="flex flex-col gap-4 w-full mb-6">
                            <select
                                name="supplierId"
                                value={formRestock.supplierId}
                                onChange={handleChangeSupplier}
                                className="text-2xl p-3 rounded-lg"
                                required
                            >
                                <option value="">Seleccione proveedor</option>
                                {suppliers.map((sup) => (
                                    <option key={sup.id} value={sup.id}>{sup.name}</option>
                                ))}
                            </select>
                            {formRestock.supplierId && (
                                <div className="flex flex-col gap-4">
                                    <div className="max-h-64 overflow-y-auto bg-white rounded-lg p-3">
                                        {formRestock.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-md mb-2"
                                            >
                                                <select
                                                    value={item.ingredientId}
                                                    onChange={(e) => handleChangeItem(index, "ingredientId", e.target.value)}
                                                    className="text-2xl p-3 rounded-lg flex-1"
                                                    required
                                                >
                                                    <option value="">Seleccione ingrediente</option>
                                                    {availableIngredients.map((ing) => (
                                                        <option key={ing.id} value={ing.id}>{ing.name} ({ing.category})</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) => handleChangeItem(index, "quantity", e.target.value)}
                                                    placeholder="Cantidad"
                                                    className="text-2xl p-3 rounded-lg w-1/4"
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.cost}
                                                    onChange={(e) => handleChangeItem(index, "cost", e.target.value)}
                                                    placeholder="Costo"
                                                    className="text-2xl p-3 rounded-lg w-1/4"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="bg-blue-500 text-white text-2xl py-3 rounded-lg hover:bg-blue-600"
                                    >
                                        Añadir Ingrediente
                                    </button>
                                </div>
                            )}
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                                disabled={!formRestock.supplierId || formRestock.items.length === 0}
                            >
                                Registrar Reabastecimiento
                            </button>
                        </form>
                        <div className="w-full max-w-4xl space-y-4">
                            {restocks.map((restock) => (
                                <div
                                    key={restock.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md cursor-pointer"
                                    onClick={() => setSelectedRestock(restock)}
                                >
                                    <div>
                                        <strong>Reabastecimiento #{restock.id}</strong> – Proveedor: {suppliers.find((sup) => sup.id === restock.supplierId)?.name}, Ingredientes: {restock.items.length}, Costo: ${restock.totalCost}, Fecha: {restock.date}
                                    </div>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                        onClick={(e) => { e.stopPropagation(); setSelectedRestock(restock); }}
                                    >
                                        Ver Detalles
                                    </button>
                                </div>
                            ))}
                        </div>
                        {selectedRestock && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-amber-100 p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                                    <h3 className="text-3xl font-bold mb-4">Detalles del Reabastecimiento #{selectedRestock.id}</h3>
                                    <p className="text-2xl mb-2">
                                        <strong>Proveedor:</strong> {suppliers.find((sup) => sup.id === selectedRestock.supplierId)?.name}
                                    </p>
                                    <p className="text-2xl mb-2">
                                        <strong>Fecha:</strong> {selectedRestock.date}
                                    </p>
                                    <p className="text-2xl mb-4">
                                        <strong>Costo Total:</strong> ${selectedRestock.totalCost}
                                    </p>
                                    <h4 className="text-2xl font-bold mb-2">Ingredientes:</h4>
                                    <div className="space-y-2">
                                        {selectedRestock.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white p-3 rounded-lg shadow-md text-2xl"
                                            >
                                                <strong>{ingredients.find((ing) => ing.id === item.ingredientId)?.name}</strong> ({ingredients.find((ing) => ing.id === item.ingredientId)?.category}) – Cantidad: {item.quantity} {ingredients.find((ing) => ing.id === item.ingredientId)?.unit}, Costo: ${item.cost}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="bg-red-500 text-white text-2xl py-3 px-6 rounded-lg hover:bg-red-600 mt-6"
                                        onClick={() => setSelectedRestock(null)}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}