import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import TableCard from "../../components/spaces/TableCard";
import { getRooms, getTables } from "./spacesService";

export default function Tables() {
    const { roomId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [tables, setTables] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [roomsResponse, tablesResponse] = await Promise.all([
                    getRooms(),
                    getTables(),
                ]);
                setRooms(roomsResponse.data);
                setTables(tablesResponse.data);
            } catch (err) {
                setError("Error al cargar los datos");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const selectedRoom = rooms.find((room) => room.id === Number(roomId));
    const selectedRoomTables = selectedRoom?.mesasIds || [];

    if (isLoading) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[60%] w-[80%] bg-amber-200 flex items-center justify-center">
                            <p className="text-3xl font-bold">Cargando mesas...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (!selectedRoom) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[60%] w-[80%] bg-amber-200 flex items-center justify-center">
                            <p className="text-3xl font-bold text-red-600">Sala no encontrada</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error) {
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
                        {selectedRoomTables.length > 0 ? (
                            <div className="h-full overflow-x-auto flex gap-4 p-4">
                                {selectedRoomTables.map((tableId) => {
                                    const table = tables.find((t) => t.id === tableId);
                                    return table ? <TableCard key={tableId} tableData={table} /> : null;
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-2xl text-gray-500">No hay mesas en esta sala</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}