import { useState } from "react";

export default function CategoryManager({ categories, addCategory, deleteCategory, updateCategory, dishes, updateDish }) {
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryEditValue, setCategoryEditValue] = useState("");

    const handleUpdateCategory = () => {
        const oldName = editingCategory;
        const newName = categoryEditValue;
        if (!newName) return;
        deleteCategory(oldName);
        addCategory(newName);
        dishes
            .filter((d) => d.categoria === oldName)
            .forEach((d) => updateDish({ ...d, categoria: newName }));
        setEditingCategory(null);
        setCategoryEditValue("");
    };

    return (
        <div className="w-1/3 h-full flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Categorías</h2>
            <div className="flex gap-2">
                <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 p-4 rounded text-xl"
                    placeholder="Nueva categoría"
                />
                <button
                    onClick={() => {
                        if (newCategory) addCategory(newCategory);
                        setNewCategory("");
                    }}
                    className="bg-green-500 px-6 py-4 text-white text-xl rounded"
                >
                    Agregar
                </button>
            </div>
            <ul className="flex flex-col gap-3 overflow-y-auto">
                {categories.map((cat) => (
                    <li key={cat} className="bg-white rounded-xl p-4 flex justify-between items-center text-xl">
                        {editingCategory === cat ? (
                            <>
                                <input
                                    value={categoryEditValue}
                                    onChange={(e) => setCategoryEditValue(e.target.value)}
                                    className="flex-1 p-2 mr-4 rounded"
                                />
                                <button onClick={handleUpdateCategory} className="bg-green-500 text-white px-4 py-2 rounded text-lg mr-2">✔</button>
                                <button onClick={() => setEditingCategory(null)} className="bg-gray-400 text-white px-4 py-2 rounded text-lg">✖</button>
                            </>
                        ) : (
                            <>
                                <span>{cat}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingCategory(cat); setCategoryEditValue(cat); }} className="bg-blue-500 text-white px-4 py-2 rounded text-lg">Editar</button>
                                    <button onClick={() => deleteCategory(cat)} className="bg-red-500 text-white px-4 py-2 rounded text-lg">Eliminar</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
