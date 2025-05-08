import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import RoomAdmin from "../components/spaces/RoomAdmin";

export default function Spaces() {
    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center ">
                    <div className="h-[80%] w-[80%] bg-amber-200 p-4 flex gap-6">
                        <RoomAdmin />
                    </div>
                </main>
            </div>
        </div>
    );
}