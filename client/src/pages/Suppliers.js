import { useState } from "react";
import NavBar from "../components/navbar/NavBar";
import InventoryNavBar from "../components/inventory/InventoryNavBar";
import Header from "../components/header/Header";
import { useMock } from "../contexts/MockSocketContext";

export default function Suppliers() {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier, ingredients } = useMock();
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formSupplier, setFormSupplier] = useState({ name: "", ingredientIds: [] });

    const handleChangeSupplier = (e) => {
        const { name, value } = e.target;
        if (name === "ingredientIds") {
            const ids = Array.from(e.target.selectedOptions, (option) => Number(option.value));
            setFormSupplier((prev) => ({ ...prev, ingredientIds: ids }));
        } else {
            setFormSupplier((prev) => ({ ...prev, [name]: value }));
        }
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

    const startEditSupplier = (supplier) => {
        setFormSupplier({ name: supplier.name, ingredientIds: supplier.ingredientIds });
        setEditingSupplier(supplier.id);
    };

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full flex flex-col">
                <Header />
                <InventoryNavBar />
                <main className="h-[80%] w-full flex items-center justify-center">
                    <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
                        <h2 className="text-3xl font-bold">Proveedores</h2>
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
                </main>
            </div>
        </div>
    );
}