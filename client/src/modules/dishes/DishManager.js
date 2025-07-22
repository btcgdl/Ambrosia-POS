import { useState } from "react";

export default function DishManager({ dishes, categories, addDish, updateDish, deleteDish }) {
    const [newDish, setNewDish] = useState({ name: "", price: "", category_id: "" });
    const [editingDish, setEditingDish] = useState(null);
    const [error, setError] = useState("");

    const validateDish = (dish) => {
        if (!dish.name.trim()) return "El nombre es requerido";
        if (!dish.category_id) return "La categoría es requerida";
        if (!dish.price || isNaN(dish.price) || parseFloat(dish.price) <= 0) return "El precio debe ser un número mayor a 0";
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
            await addDish({ ...newDish, price: parseFloat(newDish.price)});
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
            await updateDish({ ...editingDish, price: parseFloat(editingDish.price)});
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
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    placeholder="Nombre"
                    className="p-4 rounded text-xl flex-1"
                />
                <input
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="Precio"
                    className="p-4 rounded text-xl w-[120px]"
                    type="number"
                    min="0"
                    step="0.01"
                />
                <select
                    value={newDish.category_id}
                    onChange={(e) => setNewDish({ ...newDish, category_id: e.target.value })}
                    className="p-4 rounded text-xl"
                >
                    <option value="">Categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                                    value={editingDish.name}
                                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                                    className="p-2 rounded mr-2"
                                />
                                <input
                                    value={editingDish.price}
                                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                                    className="p-2 rounded mr-2 w-[100px]"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                />
                                <select
                                    value={editingDish.category_id}
                                    onChange={(e) => setEditingDish({ ...editingDish, category_id: e.target.value })}
                                    className="p-2 rounded mr-2"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                <button onClick={handleUpdateDish} className="bg-green-500 text-white px-4 py-2 rounded text-lg mr-2">✔</button>
                                <button onClick={() => { setEditingDish(null); setError(""); }} className="bg-gray-400 text-white px-4 py-2 rounded text-lg">✖</button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">
                                    {dish.name} - ${dish.price}
                                    ({categories.find(c => c.id === dish.category_id)?.name || 'Sin categoría'})
                                </span>
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