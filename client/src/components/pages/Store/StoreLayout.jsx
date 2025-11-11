"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const storeNavItems = [
  { path: "/store/users", label: "Usuarios" },
  { path: "/store/products", label: "Productos" },
  { path: "/store/cart", label: "Caja" },
  { path: "/store/settings", label: "Configuración" }, // placeholder
];

export default function StoreLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#d7f0c3] border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold">AMBROSIA</h1>
          <p className="text-xs text-gray-600">Simple Store</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {storeNavItems.map((item) => {
              const isActive =
                pathname === item.path ||
                pathname.startsWith(item.path + "/");

              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-white text-green-800 font-semibold shadow-sm"
                        : "hover:bg-gray-100 text-gray-800"
                    }`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-green-200 text-sm">
          <button className="w-full flex items-center justify-between text-gray-700 hover:text-green-800">
            <span>Cerrar sesión</span>
            <span>⏻</span>
          </button>
        </div>
      </aside>

      {/* Store main content */}
      <main className="flex-1 bg-[#e8f6df] p-6">{children}</main>
    </div>
  );
}
