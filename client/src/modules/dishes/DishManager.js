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
        <div className="w-full max-w-4xl h-full flex flex-col gap-4 overflow-x-hidden">
            <h2 className="text-3xl font-bold break-words">Platillos</h2>

            {error && <p className="text-red-600 text-xl break-words">{error}</p>}

            <div className="flex flex-wrap gap-2 w-full">
                <input
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                    placeholder="Nombre"
                    className="p-2 rounded text-base flex-1 min-w-[140px]"
                />
                <input
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                    placeholder="Precio"
                    className="p-2 rounded text-base w-[100px]"
                    type="number"
                    min="0"
                    step="0.01"
                />
                <select
                    value={newDish.category_id}
                    onChange={(e) => setNewDish({ ...newDish, category_id: e.target.value })}
                    className="p-2 rounded text-base min-w-[140px]"
                >
                    <option value="">Categoría</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={handleSaveDish}
                    className="bg-green-600 text-white px-4 py-2 rounded text-base whitespace-nowrap"
                >
                    Agregar
                </button>
            </div>

            <ul className="flex flex-col gap-3 overflow-y-auto">
                {dishes.map((dish) => (
                    <li
                        key={dish.id}
                        className="bg-white rounded-xl p-4 flex flex-wrap justify-between items-center text-base gap-2 break-words"
                    >
                        {editingDish?.id === dish.id ? (
                            <>
                                <input
                                    value={editingDish.name}
                                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                                    className="p-2 rounded mr-2 flex-1 min-w-[120px]"
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
                                    className="p-2 rounded mr-2 min-w-[140px]"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleUpdateDish}
                                        className="bg-green-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                                    >
                                        ✔
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingDish(null);
                                            setError("");
                                        }}
                                        className="bg-gray-400 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                                    >
                                        ✖
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
            <span className="flex-1 min-w-0 break-words">
              {dish.name} - ${dish.price} (
                {categories.find((c) => c.id === dish.category_id)?.name || "Sin categoría"})
            </span>
                                <div className="flex gap-2 mt-2 flex-wrap justify-end">
                                    <button
                                        onClick={() => setEditingDish(dish)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteDish(dish.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}