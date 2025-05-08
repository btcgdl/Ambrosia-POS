import { useState } from "react";
import { useMock } from "../../contexts/MockSocketContext";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";
import TableAdmin from "./TableAdmin";

export default function RoomAdmin() {
    const { rooms, addRoom, updateRoom, deleteRoom } = useMock();
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);

    const selectedRoom = rooms.find(r => r.id === selectedRoomId) || null;

    return (
        <div className="p-4 flex flex-col gap-6 w-full">
            <div className="flex gap-6">
                <div className="w-1/2">
                    <RoomList
                        rooms={rooms}
                        onSelect={setSelectedRoomId}
                        onEdit={setEditingRoom}
                        onDelete={(id) => {
                            if (selectedRoomId === id) setSelectedRoomId(null);
                            deleteRoom(id);
                        }}
                        selectedRoomId={selectedRoomId}
                    />
                </div>
                <div className="w-1/2">
                    <RoomForm
                        onSubmit={(room) => {
                            editingRoom ? updateRoom(room) : addRoom(room);
                            setEditingRoom(null);
                        }}
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
