import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Inventory() {
    const { ingredients, addIngredient, updateIngredient, deleteIngredient, suppliers, addSupplier, updateSupplier, deleteSupplier, restocks, addRestock, ingredientCategories, addIngredientCategory, deleteIngredientCategory } = useMock();
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formIngredient, setFormIngredient] = useState({ name: "", category: "", quantity: "", unit: "kg", lowStockThreshold: 10, costPerUnit: "" });
    const [formSupplier, setFormSupplier] = useState({ name: "", ingredientIds: [] });
    const [formRestock, setFormRestock] = useState({ ingredientId: "", supplierId: "", quantity: "", totalCost: "" });
    const [formCategory, setFormCategory] = useState("");
    const [filterCategory, setFilterCategory] = useState("Todas");

    const handleChangeIngredient = (e) => {
        const { name, value } = e.target;
        setFormIngredient((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeSupplier = (e) => {
        const { name, value } = e.target;
        if (name === "ingredientIds") {
            const ids = Array.from(e.target.selectedOptions, (option) => Number(option.value));
            setFormSupplier((prev) => ({ ...prev, ingredientIds: ids }));
        } else {
            setFormSupplier((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleChangeRestock = (e) => {
        const { name, value } = e.target;
        setFormRestock((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeCategory = (e) => {
        setFormCategory(e.target.value);
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

    const handleSubmitSupplier = (e) => {
        e.preventDefault();
        if (editingSupplier) {
            updateSupplier({ ...formSupplier, id: editingSupplier });
        } else {
            addSupplier(formSupplier);
        }
        setFormSupplier({ name: "", ingredientIds: [] });
        setEditingSupplier(null);
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

    const handleSubmitCategory = (e) => {
        e.preventDefault();
        if (formCategory) {
            addIngredientCategory(formCategory);
            setFormCategory("");
        }
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

    const startEditSupplier = (supplier) => {
        setFormSupplier({ name: supplier.name, ingredientIds: supplier.ingredientIds });
        setEditingSupplier(supplier.id);
    };

    const filteredIngredients = filterCategory === "Todas"
        ? ingredients
        : ingredients.filter((ing) => ing.category === filterCategory);

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Gestión de Inventario</h2>

                        {/* Categorías de Ingredientes */}
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-4">Categorías de Ingredientes</h3>
                            <form onSubmit={handleSubmitCategory} className="flex flex-col gap-4 w-full max-w-xl mb-6">
                                <input
                                    name="category"
                                    value={formCategory}
                                    onChange={handleChangeCategory}
                                    placeholder="Nueva categoría"
                                    className="text-2xl p-3 rounded-lg"
                                    required
                                />
                                <button type="submit" className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600">
                                    Agregar Categoría
                                </button>
                            </form>
                            <div className="w-full max-w-4xl space-y-4">
                                {ingredientCategories.map((category) => (
                                    <div key={category} className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md">
                                        <div>{category}</div>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => deleteIngredientCategory(category)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ingredientes */}
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-4">Ingredientes</h3>
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

                        {/* Proveedores */}
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-4">Proveedores</h3>
                            <form onSubmit={handleSubmitSupplier} className="flex flex-col gap-4 w-full max-w-xl mb-6">
                                <input
                                    name="name"
                                    value={formSupplier.name}
                                    onChange={handleChangeSupplier}
                                    placeholder="Nombre del proveedor"
                                    className="text-2xl p-3 rounded-lg"
                                    required
                                />
                                <select
                                    name="ingredientIds"
                                    multiple
                                    value={formSupplier.ingredientIds}
                                    onChange={handleChangeSupplier}
                                    className="text-2xl p-3 rounded-lg"
                                >
                                    {ingredients.map((ing) => (
                                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
                                >
                                    {editingSupplier ? "Actualizar Proveedor" : "Agregar Proveedor"}
                                </button>
                            </form>
                            <div className="w-full max-w-4xl space-y-4">
                                {suppliers.map((supplier) => (
                                    <div
                                        key={supplier.id}
                                        className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
                                    >
                                        <div>
                                            <strong>{supplier.name}</strong> – Ingredientes: {supplier.ingredientIds.map((id) => ingredients.find((ing) => ing.id === id)?.name).join(", ")}
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                                onClick={() => startEditSupplier(supplier)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                onClick={() => deleteSupplier(supplier.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reabastecimientos */}
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-4">Reabastecimientos</h3>
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
                    </div>
                </main>
            </div>
        </div>
    );
}