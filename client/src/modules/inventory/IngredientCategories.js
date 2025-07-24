import { useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import InventoryNavBar from "../../components/inventory/InventoryNavBar";
import Header from "../../components/header/Header";
import { useMock } from "../../contexts/MockSocketContext";

export default function IngredientCategories() {
  const {
    ingredientCategories,
    addIngredientCategory,
    deleteIngredientCategory,
  } = useMock();
  const [formCategory, setFormCategory] = useState("");

  const handleChangeCategory = (e) => {
    setFormCategory(e.target.value);
  };

  const handleSubmitCategory = (e) => {
    e.preventDefault();
    if (formCategory) {
      addIngredientCategory(formCategory);
      setFormCategory("");
    }
  };

  return (
    <main className="h-[90%] w-full flex items-center justify-center">
      <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
        <h2 className="text-3xl font-bold">Categorías de Ingredientes</h2>
        <form
          onSubmit={handleSubmitCategory}
          className="flex flex-col gap-4 w-full max-w-xl mb-6"
        >
          <input
            name="category"
            value={formCategory}
            onChange={handleChangeCategory}
            placeholder="Nueva categoría"
            className="text-2xl p-3 rounded-lg"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
          >
            Agregar Categoría
          </button>
        </form>
        <div className="w-full max-w-4xl space-y-4">
          {ingredientCategories.map((category) => (
            <div
              key={category}
              className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
            >
              <div>{category}</div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={() => deleteIngredientCategory(category)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
