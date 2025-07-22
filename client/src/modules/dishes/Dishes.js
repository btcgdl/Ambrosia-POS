import { useState, useEffect } from "react";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import CategoryManager from "./CategoryManager";
import DishManager from "./DishManager";
import { getDishes, addDish, updateDish, deleteDish, getCategories, addCategory, deleteCategory, updateCategory } from "./dishesService";

export default function Dishes() {
    const [dishes, setDishes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const [dishesResponse, categoriesResponse] = await Promise.all([
                    getDishes(),
                    getCategories(),
                ]);
                setDishes(dishesResponse);
                setCategories(categoriesResponse);
            } catch (err) {
                setError("Error al cargar los datos");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAddCategory = async (category) => {
        try {
            setError("");
            await addCategory(category);
            const response = await getCategories();
            setCategories(response);
        } catch (err) {
            setError(err.message || "Error al agregar la categoría");
        }
    };

    const handleDeleteCategory = async (category) => {
        try {
            setError("");
            await deleteCategory(category);
            const [dishesResponse, categoriesResponse] = await Promise.all([
                getDishes(),
                getCategories(),
            ]);
            setDishes(dishesResponse);
            setCategories(categoriesResponse);
        } catch (err) {
            setError(err.message || "Error al eliminar la categoría");
        }
    };

    const handleUpdateCategory = async (id, newName) => {
        try {
            setError("");
            await updateCategory(id, newName);
            const [dishesResponse, categoriesResponse] = await Promise.all([
                getDishes(),
                getCategories(),
            ]);
            setDishes(dishesResponse);
            setCategories(categoriesResponse);
        } catch (err) {
            setError(err.message || "Error al actualizar la categoría");
        }
    };

    const handleAddDish = async (dish) => {
        try {
            setError("");
            await addDish(dish);
            const response = await getDishes();
            setDishes(response);
        } catch (err) {
            setError(err.message || "Error al agregar el platillo");
        }
    };

    const handleUpdateDish = async (dish) => {
        try {
            setError("");
            await updateDish(dish);
            const response = await getDishes();
            setDishes(response);
        } catch (err) {
            setError(err.message || "Error al actualizar el platillo");
        }
    };

    const handleDeleteDish = async (dishId) => {
        try {
            setError("");
            await deleteDish(dishId);
            const response = await getDishes();
            setDishes(response);
        } catch (err) {
            setError(err.message || "Error al eliminar el platillo");
        }
    };

    if (isLoading) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[95%] w-[95%] bg-amber-100 rounded-xl p-4 flex items-center justify-center">
                            <p className="text-3xl font-bold">Cargando platillos y categorías...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error && dishes.length === 0 && categories.length === 0) {
        return (
            <div className="flex w-screen h-screen">
                <NavBar />
                <div className="w-[75%] h-full">
                    <Header />
                    <main className="h-[90%] w-full flex items-center justify-center">
                        <div className="h-[95%] w-[95%] bg-amber-100 rounded-xl p-4 flex items-center justify-center">
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
                    <div className="h-[95%] w-[95%] bg-amber-100 rounded-xl p-4 flex gap-6">
                        {error && <p className="text-red-600 text-xl absolute top-20">{error}</p>}
                        <CategoryManager
                            categories={categories}
                            addCategory={handleAddCategory}
                            deleteCategory={handleDeleteCategory}
                            updateCategory={handleUpdateCategory}
                        />
                        <DishManager
                            dishes={dishes}
                            categories={categories}
                            addDish={handleAddDish}
                            updateDish={handleUpdateDish}
                            deleteDish={handleDeleteDish}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}