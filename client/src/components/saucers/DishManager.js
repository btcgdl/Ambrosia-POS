import { useState } from "react";

export default function DishManager({ dishes, categories, addDish, updateDish, deleteDish }) {
    const [newDish, setNewDish] = useState({ nombre: "", categoria: "", precio: "" });
    const [editingDish, setEditingDish] = useState(null);

    const handleSaveDish = () => {
        if (!newDish.nombre || !newDish.categoria || !newDish.precio) return;
        addDish({ ...newDish, precio: parseFloat(newDish.precio) });
        setNewDish({ nombre: "", categoria: "", precio: "" });
    };

    const handleUpdateDish = () => {
        if (!editingDish.nombre || !editingDish.categoria || !editingDish.precio) return;
        updateDish({ ...editingDish, precio: parseFloat(editingDish.precio) });
        setEditingDish(null);
    };

    return (
        <div className="w-2/3 h-full flex flex-col gap-4">
            <h2 className="text-3xl font-bold">Platillos</h2>
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
                                <button onClick={() => setEditingDish(null)} className="bg-gray-400 text-white px-4 py-2 rounded text-lg">✖</button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1">{dish.nombre} - ${dish.precio} ({dish.categoria})</span>
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
