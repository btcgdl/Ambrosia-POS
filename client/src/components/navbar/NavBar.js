import { useUserRole } from "../../contexts/UserRoleContext";
import NavBarButton from "./NavBarButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, Children } from "react";
import { getHomeRoute } from "../../utils/getHomeRoute";
import { getModules, removeModules } from "../../core/moduleRegistry";
import {
  getCookieValue,
  logoutFromService,
  updateRole,
} from "../../modules/auth/authService";
import { getLogger } from "../../utils/loggerStore";

export default function NavBar({ children }) {
  const { userRole } = useUserRole();
  const navigate = useNavigate();
  const showLogger = getLogger();

  useEffect(() => {}, []);

  return (
    <div className="flex w-screen h-screen">
      <aside className="w-[25%] h-full bg-[var(--color-primary)] flex flex-col">
        <div className="h-[25%] flex flex-col items-center justify-end">
          <i
            className="bi bi-house-door-fill text-[100px] cursor-pointer"
            onClick={() => navigate(getHomeRoute())}
          ></i>
          <p className="text-white text-[15px]">{userRole?.toUpperCase()}</p>
        </div>
        <div className="h-[80%] overflow-y-auto flex flex-col gap-7 py-4 scrollbar-hide">
          {Object.values(getModules()).flatMap((module) =>
            (module.navItems || [])
              .filter(
                (item) =>
                  !item.roles ||
                  item.roles.length === 0 ||
                  item.roles.some((role) => role === userRole),
              )
              .map((item) => (
                <NavBarButton
                  key={item.path}
                  text={item.label}
                  icon={item.icon}
                  onClick={() => {
                    navigate(item.path);
                  }}
                />
              )),
          )}
          <NavBarButton
            text="Salir"
            icon="box-arrow-right"
            onClick={() => {
              if (getCookieValue("accessToken") === null) {
                showLogger("error", "No tiene una sesión activa");
                return;
              }
              if (logoutFromService()) {
                window.location.reload();
              } else {
                showLogger("error", "Error logging out");
              }
            }}
          />
        </div>
      </aside>
      {/* 👇 El cambio está en esta línea */}
      <div className="w-[75%] h-full overflow-y-auto">{children}</div>
    </div>
  );
}
