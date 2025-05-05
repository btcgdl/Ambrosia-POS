import { useEffect, useState } from "react";

export default function TableForm({ onSubmit, onCancel, initialData }) {
    const [nombre, setNombre] = useState("");
    const [estado, setEstado] = useState("libre");

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre || "");
            setEstado(initialData.estado || "libre");
        } else {
            setNombre("");
            setEstado("libre");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        onSubmit({
            ...initialData,
            nombre,
            estado,
        });

        setNombre("");
        setEstado("libre");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-3">
            <div>
                <label className="block text-sm font-medium">Nombre de la Mesa</label>
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium">Estado</label>
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full border p-2 rounded"
                >
                    <option value="libre">Libre</option>
                    <option value="ocupada">Ocupada</option>
                </select>
            </div>
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    {initialData ? "Actualizar" : "Agregar"}
                </button>
            </div>
        </form>
    );
}
