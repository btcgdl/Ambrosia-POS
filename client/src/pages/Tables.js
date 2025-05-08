import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import {useParams} from "react-router-dom";
import Table from "../components/tables/Table";
import {useMock} from "../contexts/MockSocketContext";

export default function Tables() {
    const { rooms, tables } = useMock();
    const { roomId } = useParams();

    const selectedRoomTables = rooms?.find((room) => room.id === Number(roomId))?.mesasIds;


    return(<>
        <div className="flex w-screen h-screen">
            <NavBar></NavBar>
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center ">
                    <div className="h-[60%] w-[80%] bg-amber-200">
                            {selectedRoomTables ? (<>
                                <div className="h-full overflow-x-auto flex gap-4 p-4">
                                    {selectedRoomTables.map((tableId) => (
                                        <Table key={tableId} tableData={tables.find(table => table.id === tableId)} />
                                    ))}
                                </div>
                            </>) : (<>
                                Loading...
                            </>)}
                    </div>
                </main>
            </div>
        </div>
    </>);
}