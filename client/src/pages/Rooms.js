import NavBar from "../components/navbar/NavBar";
import { useMockSocket } from "../testing/useMockSocket";
import Header from "../components/header/Header";
import Room from "../components/rooms/Room";

export default function Rooms() {
    const { rooms } = useMockSocket();
    return(<>
        <div className="flex w-screen h-screen">
            <NavBar></NavBar>
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center ">
                    <div className="h-[60%] w-[80%] bg-amber-200">
                        {rooms ? (<>
                            <div className="h-full overflow-x-auto flex gap-4 p-4">
                                {rooms.map((room) => (
                                    <Room key={room.id} roomData={room} />
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