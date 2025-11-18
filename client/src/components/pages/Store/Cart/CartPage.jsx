"use client";

import StoreLayout from "../StoreLayout";

const PRODUCTS = [
  {
    id: 1,
    name: "Jade Plus",
    category: "Hardware Wallet",
    price: 4000,
    stock: 19,
    sku: "jade-plus-wallet",
  },
  {
    id: 2,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    price: 1600,
    stock: 18,
    sku: "jade-wallet",
  },
  {
    id: 3,
    name: "M5 Stickplus 2",
    category: "Electronica",
    price: 600,
    stock: 9,
    sku: "m5-stickplus-2",
  },
  {
    id: 4,
    name: "Jade Plus",
    category: "Hardware Wallet",
    price: 4000,
    stock: 19,
    sku: "jade-plus-wallet-2",
  },
  {
    id: 5,
    name: "Jade Wallet",
    category: "Hardware Wallet",
    price: 1600,
    stock: 18,
    sku: "jade-wallet-2",
  },
  {
    id: 6,
    name: "M5 Stickplus 2",
    category: "Electronica",
    price: 600,
    stock: 9,
    sku: "m5-stickplus-2-2",
  },
];

const CART_ITEMS = [
  {
    id: 1,
    name: "M5 Stickplus 2",
    price: 600,
    qty: 2,
    total: 1200,
  },
  {
    id: 2,
    name: "Jade Wallet",
    price: 1600,
    qty: 1,
    total: 1600,
  },
];

const formatCurrency = (v) => `$ ${v.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;

export default function CartPage() {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + item.total, 0);
  const discount = 0;
  const total = subtotal - discount;

  return (
    <StoreLayout>
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-green-900">Caja</h1>
          <p className="text-sm text-gray-700">Sistema de cobro</p>
          <div className="mt-2 flex space-x-4 text-sm text-green-900">
            <button className="border-b-2 border-green-700 pb-1 font-semibold">
              Caja
            </button>
            <button className="pb-1 text-gray-500 hover:text-gray-700">
              Historial
            </button>
          </div>
        </div>
        {/* Top-right controls (language + new) */}
        <div className="flex items-center space-x-3">
          <button className="rounded-full border px-3 py-1 text-xs text-gray-700 bg-white">
            Cambiar a Español
          </button>
          <button className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
            Agregar Espacio
          </button>
        </div>
      </header>

      {/* Main content: products grid + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: search + filters + product grid (2 cols on large screens) */}
        <section className="lg:col-span-2">
          {/* Search */}
          <div className="mb-4">
            <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-sm">
              <span className="mr-2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Buscar Productos"
                className="w-full border-none bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-green-600 px-3 py-1 text-xs font-medium text-white">
              Todos
            </button>
            <button className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-green-200">
              Electronica
            </button>
            <button className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-green-200">
              Accesorios
            </button>
            <button className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-green-200">
              Hardware Wallet
            </button>
          </div>

          {/* Product cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {PRODUCTS.map((p) => (
              <article
                key={p.id}
                className="rounded-lg bg-[#f5ffe9] border border-green-200 shadow-sm p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-green-900">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-600">{p.category}</p>
                  <p className="mt-2 text-lg font-bold text-green-800">
                    {formatCurrency(p.price)}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    SKU: <span className="text-gray-800">{p.sku}</span>
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                    {p.stock} en stock
                  </span>
                  <button className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700">
                    Agregar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right: resumen */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg bg-[#f5ffe9] border border-green-200 shadow-sm p-4 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-green-900 mb-4">
              Resumen
            </h2>

            <div className="space-y-3 mb-4">
              {CART_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md bg-[#d8f2c5] px-3 py-3 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-green-900">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-700">
                        {formatCurrency(item.price)} c/u
                      </div>
                    </div>
                    <button className="text-xs text-gray-500 hover:text-red-600">
                      🗑
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full bg-white px-2 py-1 text-xs text-gray-700 border border-green-200">
                      <button className="px-1 text-sm font-bold">-</button>
                      <span className="px-2">{item.qty}</span>
                      <button className="px-1 text-sm font-bold">+</button>
                    </div>
                    <div className="text-sm font-semibold text-green-900">
                      {formatCurrency(item.total)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-auto space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Descuento</span>
                <span>{formatCurrency(discount)}</span>
              </div>
              <div className="border-t border-green-200 pt-2 flex justify-between items-center font-semibold text-green-900">
                <span>Total:</span>
                <span className="text-lg">{formatCurrency(total)}</span>
              </div>

              {/* Payment method */}
              <div className="pt-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Metodo de pago
                </label>
                <select className="w-full rounded border border-green-200 bg-white px-2 py-1 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-400">
                  <option>BTC Lightning</option>
                  <option>Tarjeta</option>
                  <option>Efectivo</option>
                </select>
              </div>

              <button className="mt-4 w-full rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                Procesar Pago
              </button>
            </div>
          </div>
        </aside>
      </div>
    </StoreLayout>
  );
}
