import {useUserRole} from "../../contexts/UserRoleContext";
import NavBarButton from "../Login/NavBarButton";
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

            <div className="h-[80%] overflow-y-auto flex flex-col gap-7 py-4">
                {userRole === "admin" && (<>
                    <NavBarButton text="Platos" icon="egg-fried" onClick={()=>{}}/>
                    <NavBarButton text="Espacios" icon="layout-text-window" onClick={()=>{}}/>
                </>)}
                <NavBarButton text="Pedidos" icon="receipt" onClick={()=>{}}/>
                {userRole === "admin" && (<>
                    <NavBarButton text="Conf" icon="gear-fill" onClick={()=>{}}/>
                    <NavBarButton text="Usuarios" icon="people-fill" onClick={()=>{}}/>
                </>)}
                <NavBarButton text="Salir" icon="box-arrow-right" onClick={()=>{}}/>
            </div>
        </aside>
    </>)
}