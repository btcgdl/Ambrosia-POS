import { useState } from "react";

export default function CategoryManager({ categories, addCategory, deleteCategory, updateCategory}) {
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryEditValue, setCategoryEditValue] = useState("");
    const [error, setError] = useState("");

    const handleAddCategory = async () => {
        if (!newCategory) {
            setError("La categoría no puede estar vacía");
            return;
        }
        try {
            setError("");
            await addCategory(newCategory);
            setNewCategory("");
        } catch (err) {
            setError(err.message || "Error al agregar la categoría");
        }
    };

    const handleUpdateCategory = async () => {
        if (!categoryEditValue) {
            setError("La categoría no puede estar vacía");
            return;
        }
        try {
            setError("");
            await updateCategory(editingCategory.id, categoryEditValue);
            setEditingCategory(null);
            setCategoryEditValue("");
        } catch (err) {
            setError(err.message || "Error al actualizar la categoría");
        }
    };

    return (
        <div className="w-1/3 h-full flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Categorías</h2>
            {error && <p className="text-red-600 text-xl">{error}</p>}
            <div className="flex gap-2">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 p-4 rounded text-xl"
                    placeholder="Nueva categoría"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-green-500 px-6 py-4 text-white text-xl rounded"
                >
                    Agregar
                </button>
            </div>
            <ul className="flex flex-col gap-3 overflow-y-auto">
                {categories.map((cat) => (
                    <li key={cat.id} className="bg-white rounded-xl p-4 flex justify-between items-center text-xl">
                        {editingCategory?.id === cat.id ? (
                            <>
                                <input
                                    value={categoryEditValue}
                                    onChange={(e) => setCategoryEditValue(e.target.value)}
                                    className="flex-1 p-2 mr-4 rounded"
                                />
                                <button onClick={handleUpdateCategory} className="bg-green-500 text-white px-4 py-2 rounded text-lg mr-2">✔</button>
                                <button onClick={() => { setEditingCategory(null); setCategoryEditValue(""); setError(""); }} className="bg-gray-400 text-white px-4 py-2 rounded text-lg">✖</button>
                            </>
                        ) : (
                            <>
                                <span>{cat.name}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingCategory(cat); setCategoryEditValue(cat.name); }} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">Editar</button>
                                    <button onClick={() => deleteCategory(cat.id)} className="bg-red-500 text-white px-4 py-2 rounded text-lg">Eliminar</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
