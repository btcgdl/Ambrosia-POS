"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useModules } from "../hooks/useModules";
import { useContext } from "react";
import { AuthContext } from "../modules/auth/AuthProvider";
import { getHomeRoute } from "../lib/getHomeRoute";
import LoadingCard from "./LoadingCard";
import * as LucideIcons from "lucide-react";

// Componente para iconos Lucide React dinámico
function Icon({ name, className = "w-5 h-5" }) {
  // Convertir nombres con guiones a PascalCase
  const formatIconName = (iconName) => {
    return iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };
  const formattedName = formatIconName(name);
  const IconComponent = LucideIcons[formattedName] || LucideIcons.FileText;
  return <IconComponent className={className} />;
}

// Componente de botón para mantener consistencia con el diseño original
function NavBarButton({ text, icon, onClick, isActive }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-6 py-3 flex items-center gap-3 text-white hover:bg-white/10 transition-colors ${
        isActive ? "bg-white/20" : ""
      }`}
    >
      <Icon name={icon} className="w-6 h-6" />
      <span className="text-base">{text}</span>
    </button>
  );
}

export default function ModuleNavigation({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useContext(AuthContext);
  const { availableNavigation, isAuthenticated, isAdmin, user, isLoading } =
    useModules();

  // Si está cargando, mostrar spinner
  if (isLoading) {
    console.log(user);
    return <LoadingCard message="Cargando módulos..." />;
  }

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-1/6 h-full bg-[#1c7c54] flex flex-col">
        <div className="h-[25%] flex flex-col items-center justify-end pb-4">
          <Link
            href={isAuthenticated ? getHomeRoute(user) : "/auth"}
            className="group"
          >
            <LucideIcons.Home className="w-24 h-24 text-white cursor-pointer group-hover:scale-110 transition-transform" />
          </Link>
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <p className="text-white text-[13px] mt-1">
                  {user?.name || localStorage.getItem("username") || "Usuario"}
                </p>
                <p className="text-white/80 text-[11px]">
                  {isAdmin ? "ADMINISTRADOR" : "USUARIO"}
                </p>
              </>
            ) : (
              <p className="text-white/80 text-[13px] mt-1">INVITADO</p>
            )}
          </div>
        </div>

        <div className="h-[75%] overflow-y-auto flex flex-col gap-2 py-4 scrollbar-hide">
          {/* Mostrar navegación solo si está autenticado */}
          {isAuthenticated ? (
            <>
              {availableNavigation.map((item, index) => (
                <NavBarButton
                  key={`${item.path}-${index}`}
                  text={item.label}
                  icon={item.icon}
                  onClick={() => router.push(item.path)}
                  isActive={
                    pathname === item.path || pathname.startsWith(item.path)
                  }
                />
              ))}

              {availableNavigation.length === 0 && (
                <div className="px-6 py-3 text-white/70 text-sm text-center">
                  No hay módulos disponibles para tu rol
                </div>
              )}

              <div className="mt-auto">
                <NavBarButton
                  text="Salir"
                  icon="log-out"
                  onClick={() => {
                    logout();
                    router.push("/auth");
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Solo mostrar botón de login si no está autenticado */}
              <NavBarButton
                text="Iniciar Sesión"
                icon="log-in"
                onClick={() => router.push("/auth")}
                isActive={pathname === "/auth"}
              />
            </>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="w-[85%] h-full overflow-y-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
}
