import { useState } from "react";

export default function DishManager({ dishes, categories, addDish, updateDish, deleteDish }) {
    const [newDish, setNewDish] = useState({ nombre: "", categoria: "", precio: "" });
    const [editingDish, setEditingDish] = useState(null);
    const [error, setError] = useState("");

    const validateDish = (dish) => {
        if (!dish.nombre.trim()) return "El nombre es requerido";
        if (!dish.categoria) return "La categoría es requerida";
        if (!dish.precio || isNaN(dish.precio) || parseFloat(dish.precio) <= 0) return "El precio debe ser un número mayor a 0";
        return "";
    };

    const handleSaveDish = async () => {
        const validationError = validateDish(newDish);
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setError("");
            await addDish({ ...newDish, precio: parseFloat(newDish.precio), ingredients: [] });
            setNewDish({ nombre: "", categoria: "", precio: "" });
        } catch (err) {
            setError(err.message || "Error al agregar el platillo");
        }
    };

    const handleUpdateDish = async () => {
        const validationError = validateDish(editingDish);
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setError("");
            await updateDish({ ...editingDish, precio: parseFloat(editingDish.precio), ingredients: editingDish.ingredients || [] });
            setEditingDish(null);
        } catch (err) {
            setError(err.message || "Error al actualizar el platillo");
        }
    };

    return (
        <div className="w-2/3 h-full flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Platillos</h2>
            {error && <p className="text-red-600 text-xl">{error}</p>}
            <div className="flex gap-2">
                <input
                    value={newDish.nombre}
                    onChange={(e) => setNewDish({ ...newDish, nombre: e.target.value })}
                    placeholder="Nombre"
                    className="p-4 rounded text-xl flex-1"
                />
                <input
                    value={newDish.precio}
                    onChange={(e) => setNewDish({ ...newDish, precio: e.target.value })}
                    placeholder="Precio"
                    className="p-4 rounded text-xl w-[120px]"
                    type="number"
                    min="0"
                    step="0.01"
                />
                <select
                    value={newDish.categoria}
                    onChange={(e) => setNewDish({ ...newDish, categoria: e.target.value })}
                    className="p-4 rounded text-xl"
                >
                    <option value="">Categoría</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <button onClick={handleSaveDish} className="bg-green-600 text-white px-6 py-4 rounded text-xl">Agregar</button>
            </div>
            <ul className="flex flex-col gap-3 overflow-y-auto">
                {dishes.map((dish) => (
                    <li key={dish.id} className="bg-white rounded-xl p-4 flex justify-between items-center text-xl">
                        {editingDish?.id === dish.id ? (
                            <>
                                <input
                                    value={editingDish.nombre}
                                    onChange={(e) => setEditingDish({ ...editingDish, nombre: e.target.value })}
                                    className="p-2 rounded mr-2"
                                />
                                <input
                                    value={editingDish.precio}
                                    onChange={(e) => setEditingDish({ ...editingDish, precio: e.target.value })}
                                    className="p-2 rounded mr-2 w-[100px]"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
                                <select
                                    value={editingDish.categoria}
                                    onChange={(e) => setEditingDish({ ...editingDish, categoria: e.target.value })}
                                    className="p-2 rounded mr-2"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <button onClick={handleUpdateDish} className="bg-green-500 text-white px-4 py-2 rounded text-lg mr-2">✔</button>
                                <button onClick={() => { setEditingDish(null); setError(""); }} className="bg-gray-400 text-white px-4 py-2 rounded text-lg">✖</button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">{dish.nombre} - ${dish.precio} ({dish.categoria || 'Sin categoría'})</span>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingDish(dish)} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">Editar</button>
                                    <button onClick={() => deleteDish(dish.id)} className="bg-red-500 text-white px-4 py-2 rounded text-lg">Eliminar</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}