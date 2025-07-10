import {useUserRole} from "../../contexts/UserRoleContext";
import NavBarButton from "./NavBarButton";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {getHomeRoute} from "../../utils/getHomeRoute";
import {getModules} from "../../core/moduleRegistry";

export default function NavBar() {
    const { userRole } = useUserRole();
    const navigate = useNavigate();

    useEffect(()=>{

    },[])

    return (<>
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
                                item.roles.some((role) => role === userRole)
                        )
                        .map((item) => (
                            <NavBarButton key={item.path} text={item.label} icon={item.icon} onClick={()=>{navigate(item.path)}} />
                        ))
                )}

                {/*{userRole === "admin" && (<>
                    <NavBarButton text="Platos" icon="egg-fried" onClick={()=>{navigate("/dishes")}}/>
                    <NavBarButton text="Espacios" icon="layout-text-window" onClick={()=>{navigate("/spaces")}}/>
                </>)}
                <NavBarButton text="Pedidos" icon="receipt" onClick={()=>{navigate("/all-orders")}}/>
                {userRole === "admin" && (<>
                    <NavBarButton text="Conf" icon="gear-fill" onClick={()=>{}}/>
                    <NavBarButton text="Usuarios" icon="people-fill" onClick={()=>{navigate("/users")}}/>
                    <NavBarButton text="Roles" icon="people-fill" onClick={()=>{navigate("/roles")}}/>
                    <NavBarButton text="Inventario" icon="people-fill" onClick={()=>{navigate("/inventory/ingredients")}}/>
                    <NavBarButton text="Reportes y caja" icon="people-fill" onClick={()=>{navigate("/reports")}}/>
                </>)}*/}
                <NavBarButton text="Salir" icon="box-arrow-right" onClick={()=>{navigate("/")}}/>
            </div>
        </aside>
    </>)
}