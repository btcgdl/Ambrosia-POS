import { useNavigate } from "react-router-dom";

export default function RoomCard({ roomData }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(`/tables/${roomData.id}`)}
            className="h-full w-[200px] min-w-[200px] border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-all text-center"
        >

            <i className="bi bi-door-open-fill text-4xl mb-2"></i>
            <span className="text-lg font-semibold">{roomData.nombre}</span>
        </button>
    );
}
