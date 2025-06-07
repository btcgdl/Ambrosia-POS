import { useState, useEffect } from "react";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import RoomCard from "../../components/spaces/RoomCard";
import { getRooms } from "./spacesService";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchRooms() {
            try {
                setIsLoading(true);
                const response = await getRooms();
                setRooms(response.data);
            } catch (err) {
                setError("Error al cargar las salas");
            } finally {
                setIsLoading(false);
            }
        }
        fetchRooms();
    }, []);

    if (isLoading) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[60%] w-[80%] bg-amber-200 flex items-center justify-center">
                            <p className="text-3xl font-bold">Cargando salas...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error && rooms.length === 0) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[60%] w-[80%] bg-amber-200 flex items-center justify-center">
                            <p className="text-3xl font-bold text-red-600">{error}</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[60%] w-[80%] bg-amber-200">
                        {rooms.length > 0 ? (
                            <div className="h-full overflow-x-auto flex gap-4 p-4">
                                {rooms.map((room) => (
                                    <RoomCard key={room.id} roomData={room} />
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-2xl text-gray-500">No hay salas disponibles</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}