import { useState } from "react";

export default function     CategoryManager({ categories, addCategory, deleteCategory, updateCategory}) {
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
        <div className="w-full max-w-md h-full flex flex-col gap-4 overflow-x-hidden">
            <h2 className="text-3xl font-bold break-words">Categorías</h2>

            {error && <p className="text-red-600 text-xl break-words">{error}</p>}

            <div className="flex flex-wrap gap-2 w-full">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 p-2 rounded text-xl min-w-0"
                    placeholder="Nueva categoría"
                />
                <button
                    onClick={handleAddCategory}
                    className="bg-green-500 px-4 py-2 text-white text-base rounded whitespace-nowrap"
                >
                    Agregar
                </button>
            </div>

            <ul className="flex flex-col gap-3 overflow-y-auto">
                {categories.map((cat) => (
                    <li
                        key={cat.id}
                        className="bg-white rounded-xl p-4 flex flex-wrap justify-between items-center text-xl break-words"
                    >
                        {editingCategory?.id === cat.id ? (
                            <>
                                <input
                                    value={categoryEditValue}
                                    onChange={(e) => setCategoryEditValue(e.target.value)}
                                    className="flex-1 p-2 mr-4 rounded min-w-0"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={handleUpdateCategory}
                                        className="bg-green-500 text-white px-4 py-2 rounded text-base whitespace-nowrap"
                                    >
                                        ✔
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setCategoryEditValue("");
                                            setError("");
                                        }}
                                        className="bg-gray-400 text-white px-4 py-2 rounded text-base whitespace-nowrap"
                                    >
                                        ✖
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="break-words flex-1 min-w-0">{cat.name}</span>
                                <div className="flex gap-2 mt-2 flex-wrap justify-end">
                                    <button
                                        onClick={() => {
                                            setEditingCategory(cat);
                                            setCategoryEditValue(cat.name);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded text-base whitespace-nowrap"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded text-base whitespace-nowrap"
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
