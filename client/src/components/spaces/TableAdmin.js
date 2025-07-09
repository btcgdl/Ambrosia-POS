import { useState, useEffect } from "react";
import TableList from "./TableList";
import TableForm from "./TableForm";
import { getTables, addTable, updateTable, deleteTable, updateRoom } from "../../modules/spaces/spacesService";

export default function TableAdmin({ room }) {
    const [tables, setTables] = useState([]);
    const [editingTable, setEditingTable] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchTables() {
            try {
                setIsLoading(true);
                const response = await getTables();
                setTables(response);
            } catch (err) {
                setError("Error al cargar las mesas");
            } finally {
                setIsLoading(false);
            }
        }
        fetchTables();
    }, []);

    const roomTables = tables.filter((t) => room.mesasIds.includes(t.id));

    const handleAddOrUpdate = async (mesa) => {
        try {
            setError("");
            if (mesa.id) {
                await updateTable(mesa);
            } else {
                const nuevaMesa = { ...mesa, pedidoId: null };
                const addedTable = await addTable(nuevaMesa);
                await updateRoom({
                    ...room,
                    mesasIds: [...room.mesasIds, addedTable.id],
                });
            }
            const response = await getTables();
            setTables(response);
            setEditingTable(null);
        } catch (err) {
            setError(err.message || "Error al guardar la mesa");
        }
    };

    const handleDelete = async (id) => {
        try {
            setError("");
            await deleteTable(id);
            await updateRoom({
                ...room,
                mesasIds: room.mesasIds.filter((mId) => mId !== id),
            });
            const response = await getTables();
            setTables(response);
            if (editingTable?.id === id) setEditingTable(null);
        } catch (err) {
            setError(err.message || "Error al eliminar la mesa");
        }
    };

    if (isLoading) {
        return <div className="p-4 text-2xl">Cargando mesas...</div>;
    }

    if (error && roomTables.length === 0) {
        return <div className="p-4 text-2xl text-red-600">{error}</div>;
    }

    return (
        <div className="flex gap-6">
            {error && <p className="text-red-600 text-xl absolute top-4">{error}</p>}
            <div className="w-1/2">
                <TableList
                    tables={roomTables}
                    onEdit={setEditingTable}
                    onDelete={handleDelete}
                />
            </div>
            <div className="w-1/2">
                <TableForm
                    onSubmit={handleAddOrUpdate}
                    onCancel={() => setEditingTable(null)}
                    initialData={editingTable}
                />
            </div>
        </div>
    );
}