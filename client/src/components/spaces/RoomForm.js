// RoomForm.jsx
import { useState, useEffect } from "react";

export default function RoomForm({ onSubmit, initialData, onCancel }) {
    const [nombre, setNombre] = useState("");

    useEffect(() => {
        if (initialData) {
            setNombre(initialData.nombre);
        } else {
            setNombre("");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre.trim()) return;

        const room = {
            ...initialData,
            nombre,
        };
        onSubmit(room);
        setNombre("");
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">
                {initialData ? "Editar Sala" : "Nueva Sala"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre de la sala"
                    className="w-full px-3 py-2 border rounded"
                />
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        {initialData ? "Guardar cambios" : "Agregar sala"}
                    </button>
                    {initialData && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
