import {useUserRole} from "../../contexts/UserRoleContext";
import NavBarButton from "./NavBarButton";
import {useNavigate} from "react-router-dom";

export default function NavBar() {
    const { userRole } = useUserRole();
    const navigate = useNavigate();
    return (<>
        <aside className="w-[25%] h-full bg-[var(--color-primary)] flex flex-col">

            <div className="h-[25%] flex flex-col items-center justify-end">
                <i
                    className="bi bi-house-door-fill text-[100px] cursor-pointer"
                    onClick={() => navigate("/rooms")}
                ></i>
                <p className="text-white text-[15px]">{userRole?.toUpperCase()}</p>
            </div>

            <div className="h-[80%] overflow-y-auto flex flex-col gap-7 py-4 scrollbar-hide">
                {userRole === "admin" && (<>
                    <NavBarButton text="Platos" icon="egg-fried" onClick={()=>{navigate("/dishes")}}/>
                    <NavBarButton text="Espacios" icon="layout-text-window" onClick={()=>{navigate("/spaces")}}/>
                </>)}
                <NavBarButton text="Pedidos" icon="receipt" onClick={()=>{navigate("/all-orders")}}/>
                {userRole === "admin" && (<>
                    <NavBarButton text="Conf" icon="gear-fill" onClick={()=>{}}/>
                    <NavBarButton text="Usuarios" icon="people-fill" onClick={()=>{navigate("/users")}}/>
                    <NavBarButton text="Roles" icon="people-fill" onClick={()=>{navigate("/roles")}}/>
                    <NavBarButton text="Inventario" icon="people-fill" onClick={()=>{navigate("/inventory/ingredients")}}/>
                    <NavBarButton text="Cerrar turno" icon="people-fill" onClick={()=>{navigate("/close-turn")}}/>
                </>)}
                <NavBarButton text="Salir" icon="box-arrow-right" onClick={()=>{navigate("/")}}/>
            </div>
        </aside>
    </>)
}