"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Users, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { useTranslations } from "next-intl";
import ambrosia from "../../../../public/ambrosia.svg";


export function StoreLayout({ children }) {
  const pathname = usePathname();
  const t = useTranslations("navbar");

  const storeNavItems = [
    { path: "/store/users", label: t("users"), icon: Users },
    { path: "/store/products", label: t("products"), icon: Package },
    { path: "/store/cart", label: t("checkout"), icon: ShoppingCart },
    { path: "/store/settings", label: t("settings"), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-primary-500 relative">
        <div className="p-4 border-b border-green-300">
          <Image src={ambrosia} alt="ambrosia" />
          <p className=" text-slate-100 text-center mt-4">LSS Hardware Shop</p>
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
                    className={`flex text-2xl items-center space-x-2 p-2 rounded-md transition-colors  hover:bg-green-300 hover:text-green-800 ${
                      isActive
                        ? "bg-green-300 text-green-800"
                        : "text-slate-100"
                    }`}
                  >
                    <item.icon className="w-7 h-7" />
                    <span className="pl-2">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-green-300 text-sm absolute bottom-0 w-full">
          <Link
            href="/logout"
            className="flex text-2xl items-center space-x-2 p-2 rounded-md transition-colors text-slate-100 hover:bg-green-300 hover:text-green-800"
          >
            <LogOut className="w-7 h-7" />
            <span className="pl-2">{t("logout")}</span>
          </Link>
        </div>
      </aside>

      <main className="flex-1 gradient-fresh p-6">{children}</main>
    </div>
  );
}
