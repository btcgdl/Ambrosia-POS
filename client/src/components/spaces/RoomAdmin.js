import { useState, useEffect } from "react";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";
import TableAdmin from "./TableAdmin";
import { getRooms, addRoom, updateRoom, deleteRoom } from "../../modules/spaces/spacesService";

export default function RoomAdmin() {
    const [rooms, setRooms] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRooms() {
            try {
                setIsLoading(true);
                const response = await getRooms();
                setRooms(response);
            } catch (err) {
                setError("Error al cargar las salas");
            } finally {
                setIsLoading(false);
            }
        }
        fetchRooms();
    }, []);

    const handleAddRoom = async (room) => {
        try {
            setError("");
            await addRoom(room);
            const response = await getRooms();
            setRooms(response);
        } catch (err) {
            setError(err.message || "Error al agregar la sala");
        }
    };

    const handleUpdateRoom = async (room) => {
        try {
            setError("");
            await updateRoom(room);
            const response = await getRooms();
            setRooms(response.data);
            setEditingRoom(null);
        } catch (err) {
            setError(err.message || "Error al actualizar la sala");
        }
    };

    const handleDeleteRoom = async (id) => {
        try {
            setError("");
            await deleteRoom(id);
            const response = await getRooms();
            setRooms(response.data);
            if (selectedRoomId === id) setSelectedRoomId(null);
        } catch (err) {
            setError(err.message || "Error al eliminar la sala");
        }
    };

    const selectedRoom = Array.isArray(rooms)
        ? rooms.find((r) => r.id === selectedRoomId) || null
        : [];

    if (isLoading) {
        return <div className="p-4 text-2xl">Cargando salas...</div>;
    }

    if (error && rooms.length === 0) {
        return <div className="p-4 text-2xl text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 flex flex-col gap-6 w-full">
            {error && <p className="text-red-600 text-xl">{error}</p>}
            <div className="flex gap-6">
                <div className="w-1/2">
                    <RoomList
                        rooms={rooms}
                        onSelect={setSelectedRoomId}
                        onEdit={setEditingRoom}
                        onDelete={handleDeleteRoom}
                        selectedRoomId={selectedRoomId}
                    />
                </div>
                <div className="w-1/2">
                    <RoomForm
                        onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
                        initialData={editingRoom}
                        onCancel={() => setEditingRoom(null)}
                    />
                </div>
            </div>
            {selectedRoom && (
                <div>
                    <h2 className="text-xl font-bold mb-2">Mesas en: {selectedRoom.nombre}</h2>
                    <TableAdmin room={selectedRoom} />
                </div>
            )}
        </div>
    );
}