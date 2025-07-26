import { useState, useEffect } from "react";
import TableList from "./TableList";
import TableForm from "./TableForm";
import {
  addTable,
  updateTable,
  deleteTable,
  updateRoom,
  getTablesByRoomId,
} from "../../modules/spaces/spacesService";

export default function TableAdmin({ room }) {
  const [tables, setTables] = useState([]);
  const [editingTable, setEditingTable] = useState(null);
  const [showingTableForm, setShowingTableForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTables() {
      try {
        setIsLoading(true);
        const response = await getTablesByRoomId(room.id);
        setTables(response);
      } catch (err) {
        setError("Error al cargar las mesas");
      } finally {
        setIsLoading(false);
      }
    }
    fetchTables();
  }, [room]);

  const handleAddOrUpdate = async (mesa) => {
    try {
      setError("");
      if (mesa.id) {
        await updateTable(mesa);
      } else {
        const nuevaMesa = { ...mesa, order_id: null };
        await addTable(nuevaMesa);
      }
      const response = await getTablesByRoomId(room.id);
      setTables(Array.isArray(response) ? response : []);
      setEditingTable(null);
    } catch (err) {
      setError(err.message || "Error al guardar la mesa");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteTable(id);
      const response = await getTablesByRoomId(room.id);
      setTables(Array.isArray(response) ? response : []);
      if (editingTable?.id === id) setEditingTable(null);
    } catch (err) {
      setError(err.message || "Error al eliminar la mesa");
    }
  };

  if (isLoading) {
    return <div className="p-4 text-2xl">Cargando mesas...</div>;
  }

  return (
    <div className="flex gap-6">
      {error && <p className="text-red-600 text-xl absolute top-4">{error}</p>}
      <div className="w-1/2">
        {tables.length > 0 ? (
          <TableList
            tables={tables}
            onEdit={(table) => {
              setEditingTable(table);
              setShowingTableForm(true);
            }}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-gray-500 text-lg p-4">
            Agrega tu primera mesa desde el formulario de la derecha
          </div>
        )}
      </div>
      <div className="w-1/2">
        {showingTableForm ? (
          <>
            <TableForm
              onSubmit={handleAddOrUpdate}
              onCancel={() => {
                setEditingTable(null);
                setShowingTableForm(false);
              }}
              initialData={editingTable}
              roomId={room.id}
            />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setShowingTableForm(true);
              }}
              className="px-4 py-2 bg-green-400 text-white rounded cursor-pointer"
            >
              Añadir Una Mesa
            </button>
          </>
        )}
      </div>
    </div>
  );
}
