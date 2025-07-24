import RoomAdmin from "../../components/spaces/RoomAdmin";

export default function Spaces() {
  return (
    <main className="h-[90%] w-full flex items-center justify-center">
      <div className="h-[80%] w-[80%] bg-amber-200 p-4 flex gap-6">
        <RoomAdmin />
      </div>
    </main>
  );
}
