import { useNavigate } from "react-router-dom";
import NavBarButton from "../navbar/NavBarButton";
import {useUserRole} from "../../contexts/UserRoleContext";

export default function InventoryNavBar() {
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
                    <NavBarButton text={"Categorias"} icon={"tags-fill"} onClick={()=>{navigate("/inventory/categories")}}/>
                    <NavBarButton text={"Ingredientes"} icon={"egg-fill"} onClick={()=>{navigate("/inventory/ingredients")}}/>
                    <NavBarButton text={"Proveedores"} icon={"truck"} onClick={()=>{navigate("/inventory/suppliers")}}/>
                    <NavBarButton text={"Reabastecimientos"} icon={"cart-fill"} onClick={()=>{navigate("/inventory/restocks")}}/>
                </>)}
            </div>
        </aside>
    </>)
}