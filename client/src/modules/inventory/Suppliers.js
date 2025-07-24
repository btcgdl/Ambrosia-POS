import { useState } from "react";
import InventoryNavBar from "../../components/inventory/InventoryNavBar";
import Header from "../../components/header/Header";
import { useMock } from "../../contexts/MockSocketContext";

export default function Suppliers() {
  const {
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    ingredients,
    ingredientCategories,
  } = useMock();
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formSupplier, setFormSupplier] = useState({
    name: "",
    ingredientIds: [],
  });
  const [filterCategory, setFilterCategory] = useState("Todas");

  const handleChangeSupplier = (e) => {
    const { name, value } = e.target;
    setFormSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleIngredient = (ingredientId) => {
    setFormSupplier((prev) => {
      const ingredientIds = prev.ingredientIds.includes(ingredientId)
        ? prev.ingredientIds.filter((id) => id !== ingredientId)
        : [...prev.ingredientIds, ingredientId];
      return { ...prev, ingredientIds };
    });
  };

  const handleSubmitSupplier = (e) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier({ ...formSupplier, id: editingSupplier });
    } else {
      addSupplier(formSupplier);
    }
    setFormSupplier({ name: "", ingredientIds: [] });
    setEditingSupplier(null);
  };

  const startEditSupplier = (supplier) => {
    setFormSupplier({
      name: supplier.name,
      ingredientIds: supplier.ingredientIds,
    });
    setEditingSupplier(supplier.id);
  };

  const filteredIngredients =
    filterCategory === "Todas"
      ? ingredients
      : ingredients.filter((ing) => ing.category === filterCategory);

  return (
    <main className="h-[90%] w-full flex items-center justify-center">
      <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col items-center gap-6 overflow-y-auto">
        <h2 className="text-3xl font-bold">Proveedores</h2>
        <form
          onSubmit={handleSubmitSupplier}
          className="flex flex-col gap-4 w-full max-w-xl mb-6"
        >
          <input
            name="name"
            value={formSupplier.name}
            onChange={handleChangeSupplier}
            placeholder="Nombre del proveedor"
            className="text-2xl p-3 rounded-lg"
            required
          />
          <div className="flex flex-col gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-2xl p-3 rounded-lg"
            >
              <option value="Todas">Todas las categorías</option>
              {ingredientCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <div className="max-h-64 overflow-y-auto bg-white rounded-lg p-3">
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      formSupplier.ingredientIds.includes(ingredient.id)
                        ? "bg-green-100"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formSupplier.ingredientIds.includes(
                        ingredient.id,
                      )}
                      onChange={() => handleToggleIngredient(ingredient.id)}
                      className="h-6 w-6"
                    />
                    <span className="text-2xl">
                      {ingredient.name} ({ingredient.category})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-2xl text-gray-500">
                  No hay ingredientes en esta categoría
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white text-2xl py-3 rounded-lg hover:bg-green-600"
          >
            {editingSupplier ? "Actualizar Proveedor" : "Agregar Proveedor"}
          </button>
        </form>
        <div className="w-full max-w-4xl space-y-4">
          {suppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white p-4 rounded-xl flex justify-between items-center text-2xl shadow-md"
            >
              <div>
                <strong>{supplier.name}</strong> – Ingredientes:{" "}
                {supplier.ingredientIds
                  .map((id) => ingredients.find((ing) => ing.id === id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  onClick={() => startEditSupplier(supplier)}
                >
                  Editar
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  onClick={() => deleteSupplier(supplier.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
