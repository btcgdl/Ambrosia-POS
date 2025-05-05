// RoomList.jsx
export default function RoomList({ rooms, onSelect, onEdit, onDelete, selectedRoomId }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Salas</h2>
            <ul className="space-y-2">
                {rooms.map((room) => (
                    <li
                        key={room.id}
                        className={`p-2 border rounded flex justify-between items-center cursor-pointer ${
                            selectedRoomId === room.id ? 'bg-yellow-200' : 'bg-white'
                        }`}
                        onClick={() => onSelect(room.id)}
                    >
                        <span className="font-medium">{room.nombre}</span>
                        <div className="flex gap-2">
                            <button
                                className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(room);
                                }}
                            >
                                Editar
                            </button>
                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(room.id);
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
