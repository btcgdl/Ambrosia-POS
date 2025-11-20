"use client";

import { useState } from "react";
import { StoreLayout } from "../StoreLayout";

const PRODUCTS = [
  {
    id: 1,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    sku: "jade-wallet",
    price: 1600,
    stockLabel: "20 unidades",
    stockColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    name: "Jade Plus",
    category: "Hardware Wallet",
    sku: "jade-plus-wallet",
    price: 4000,
    stockLabel: "10 unidades",
    stockColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 3,
    name: "M5 Stickplus2",
    category: "Electronica",
    sku: "m5-stickplus-2",
    price: 600,
    stockLabel: "5 unidades",
    stockColor: "bg-red-100 text-red-700",
  },
];

const formatCurrency = (v) =>
  `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export default function ProductsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <StoreLayout>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-green-900">Productos</h1>
          <p className="text-sm text-gray-700">
            Gestiona tu catálogo de productos e inventario
          </p>
        </div>

        <button
          className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          Agregar Producto
        </button>
      </header>

      {/* Products table */}
      <section className="bg-[#f5ffe9] rounded-lg shadow border border-green-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-green-600 text-white text-left">
              <th className="py-2 px-3">Imagen</th>
              <th className="py-2 px-3">Nombre</th>
              <th className="py-2 px-3">Categoria</th>
              <th className="py-2 px-3">SKU</th>
              <th className="py-2 px-3">Precio</th>
              <th className="py-2 px-3">Stock</th>
              <th className="py-2 px-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p, idx) => (
              <tr
                key={p.id}
                className={idx % 2 === 0 ? "bg-[#f5ffe9]" : "bg-[#ecf7e2]"}
              >
                {/* Imagen placeholder */}
                <td className="py-2 px-3">
                  <div className="h-8 w-8 rounded bg-gray-200" />
                </td>

                {/* Nombre */}
                <td className="py-2 px-3 text-green-900">{p.name}</td>

                {/* Categoria pill */}
                <td className="py-2 px-3">
                  <span className="inline-flex rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium">
                    {p.category}
                  </span>
                </td>

                {/* SKU */}
                <td className="py-2 px-3 text-gray-800">{p.sku}</td>

                {/* Precio */}
                <td className="py-2 px-3 text-green-900 font-semibold">
                  {formatCurrency(p.price)}
                </td>

                {/* Stock pill */}
                <td className="py-2 px-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.stockColor}`}
                  >
                    {p.stockLabel}
                  </span>
                </td>

                {/* Acciones */}
                <td className="py-2 px-3 text-right space-x-2">
                  <button className="text-xs text-gray-600 hover:text-green-800">
                    ✏️
                  </button>
                  <button className="text-xs text-gray-600 hover:text-red-700">
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal: Agregar Producto */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-lg bg-[#f5ffe9] shadow-xl border border-green-200 p-6">
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              Agregar Producto
            </h2>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowModal(false);
              }}
            >
              {/* Nombre del Producto */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  placeholder="Nombre de producto"
                  className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Categoria
                </label>
                <select className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400">
                  <option>Electronica</option>
                  <option>Hardware Wallet</option>
                  <option>Accesorios</option>
                </select>
              </div>

              {/* SKU */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">SKU</label>
                <input
                  type="text"
                  placeholder="SKU Unico"
                  className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                />
              </div>

              {/* Precio + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    placeholder="$ 0.00"
                    className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded border border-green-200 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-400"
                  />
                </div>
              </div>

              {/* Foto del producto */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Foto del producto
                </label>
                <div className="mt-1 rounded-lg border-2 border-dashed border-green-200 bg-[#f5ffe9] px-4 py-8 text-center text-xs text-gray-600">
                  <div className="mb-2 text-2xl">📷</div>
                  <p>Sube una imagen</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    PNG, JPG o GIF (max. 5MB)
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  className="rounded-full border border-green-400 px-6 py-2 text-sm font-medium text-green-800 bg-transparent hover:bg-green-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StoreLayout>
  );
}
