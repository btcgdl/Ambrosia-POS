export default function OpenTurn() {
    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[80%] w-[80%] bg-amber-200 flex items-center justify-center">
                        <p className="text-3xl font-bold">Cargando salas...</p>
                    </div>
                </main>
            </div>
        </div>
    );
}