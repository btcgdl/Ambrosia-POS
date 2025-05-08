import { useContext, useState } from "react";
import { useMock } from "../../contexts/MockSocketContext";
import TableList from "./TableList";
import TableForm from "./TableForm";

export default function TableAdmin({ room }) {
    const { tables, addTable, updateTable, deleteTable, updateRoom } = useMock();
    const [editingTable, setEditingTable] = useState(null);

    const roomTables = tables.filter((t) => room.mesasIds.includes(t.id));

    const handleAddOrUpdate = (mesa) => {
        if (mesa.id) {
            updateTable(mesa);
        } else {
            const nuevaMesa = { ...mesa, id: Date.now(), pedidoId: null };
            addTable(nuevaMesa);
            updateRoom({
                ...room,
                mesasIds: [...room.mesasIds, nuevaMesa.id],
            });
        }
        setEditingTable(null);
    };

    const handleDelete = (id) => {
        deleteTable(id);
        updateRoom({
            ...room,
            mesasIds: room.mesasIds.filter(mId => mId !== id),
        });
        if (editingTable?.id === id) setEditingTable(null);
    };

    return (
        <div className="flex gap-6">
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
