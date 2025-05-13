import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import InventoryNavBar from "../components/inventory/InventoryNavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Ingredients() {
    const { ingredients, addIngredient, updateIngredient, deleteIngredient, ingredientCategories } = useMock();
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [formIngredient, setFormIngredient] = useState({ name: "", category: "", quantity: "", unit: "kg", lowStockThreshold: 10, costPerUnit: "" });
    const [filterCategory, setFilterCategory] = useState("Todas");

    const handleChangeIngredient = (e) => {
        const { name, value } = e.target;
        setFormIngredient((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitIngredient = (e) => {
        e.preventDefault();
        if (editingIngredient) {
            updateIngredient({ ...formIngredient, id: editingIngredient, quantity: Number(formIngredient.quantity), lowStockThreshold: Number(formIngredient.lowStockThreshold), costPerUnit: Number(formIngredient.costPerUnit) });
        } else {
            addIngredient({ ...formIngredient, quantity: Number(formIngredient.quantity), lowStockThreshold: Number(formIngredient.lowStockThreshold), costPerUnit: Number(formIngredient.costPerUnit) });
        }
        setFormIngredient({ name: "", category: "", quantity: "", unit: "kg", lowStockThreshold: 10, costPerUnit: "" });
        setEditingIngredient(null);
    };

    const startEditIngredient = (ingredient) => {
        setFormIngredient({
            name: ingredient.name,
            category: ingredient.category,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            lowStockThreshold: ingredient.lowStockThreshold,
            costPerUnit: ingredient.costPerUnit,
        });
        setEditingIngredient(ingredient.id);
    };

    const filteredIngredients = filterCategory === "Todas"
        ? ingredients
        : ingredients.filter((ing) => ing.category === filterCategory);

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full flex flex-col">
                <Header />
                <InventoryNavBar />
                <main className="h-[80%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Ingredientes</h2>
                        <div className="mb-4">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="text-2xl p-3 rounded-lg"
                            >
                                <option value="Todas">Todas</option>
                                {ingredientCategories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <form onSubmit={handleSubmitIngredient} className="flex flex-col gap-4 w-full max-w-xl mb-6">
                            <input
                                name="name"
                                value={formIngredient.name}
                                onChange={handleChangeIngredient}
                                placeholder="Ingrediente"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <select
                                name="category"
                                value={formIngredient.category}
                                onChange={handleChangeIngredient}
                                className="text-2xl p-3 rounded-lg"
                                required
                            >
                                <option value="">Seleccione categoría</option>
                                {ingredientCategories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <input
                                name="quantity"
                                type="number"
                                step="0.01"
                                value={formIngredient.quantity}
                                onChange={handleChangeIngredient}
                                placeholder="Cantidad"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <select
                                name="unit"
                                value={formIngredient.unit}
                                onChange={handleChangeIngredient}
                                className="text-2xl p-3 rounded-lg"
                            >
                                <option value="kg">kg</option>
                                <option value="piezas">piezas</option>
                                <option value="litros">litros</option>
                            </select>
                            <input
                                name="lowStockThreshold"
                                type="number"
                                value={formIngredient.lowStockThreshold}
                                onChange={handleChangeIngredient}
                                placeholder="Umbral de stock bajo"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <input
                                name="costPerUnit"
                                type="number"
                                step="0.01"
                                value={formIngredient.costPerUnit}
                                onChange={handleChangeIngredient}
                                placeholder="Costo por unidad"
                                className="text-2xl p-3 rounded-lg"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                            >
                                {editingIngredient ? "Actualizar Ingrediente" : "Agregar Ingrediente"}
                            </button>
                        </form>
                        <div className="w-full max-w-4xl space-y-4">
                            {filteredIngredients.map((ingredient) => (
                                <div
                                    key={ingredient.id}
                                    className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                >
                                    <div>
                                        <strong>{ingredient.name}</strong> ({ingredient.category}) – {ingredient.quantity} {ingredient.unit}, Costo: ${ingredient.costPerUnit}/unidad
                                        {ingredient.quantity < ingredient.lowStockThreshold && <span className="text-red-500"> (Bajo)</span>}
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            onClick={() => startEditIngredient(ingredient)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => deleteIngredient(ingredient.id)}
                                        >
                                            Eliminar
                                        </button>
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