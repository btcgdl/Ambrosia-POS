import NavBar from "../components/navbar/NavBar";
import Header from "../components/header/Header";
import CategoryManager from "../components/saucers/CategoryManager";
import DishManager from "../components/saucers/DishManager";
import { useMock } from "../contexts/MockSocketContext";

export default function Saucers() {
    const {
        dishes,
        categories,
        addDish,
        updateDish,
        deleteDish,
        addCategory,
        deleteCategory,
    } = useMock();

    return (
        <div className="flex w-screen h-screen">
            <NavBar />
            <div className="w-[75%] h-full">
                <Header />
                <main className="h-[90%] w-full flex items-center justify-center">
                    <div className="h-[95%] w-[95%] bg-amber-100 rounded-xl p-4 flex gap-6">
                        <CategoryManager
                            categories={categories}
                            addCategory={addCategory}
                            deleteCategory={deleteCategory}
                            updateCategory={() => {}}
                            dishes={dishes}
                            updateDish={updateDish}
                        />
                        <DishManager
                            dishes={dishes}
                            categories={categories}
                            addDish={addDish}
                            updateDish={updateDish}
                            deleteDish={deleteDish}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
