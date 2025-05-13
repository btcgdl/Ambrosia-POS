import { useNavigate } from "react-router-dom";
import NavBarButton from "../navbar/NavBarButton";

export default function InventoryNavBar() {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-[var(--color-primary)] flex justify-center">
            <div className="flex gap-4 p-4">
                <NavBarButton text={"Categorias"} icon={"tags-fill"} onClick={()=>{navigate("/inventory/categories")}}/>
                <NavBarButton text={"Ingredientes"} icon={"egg-fill"} onClick={()=>{navigate("/inventory/ingredients")}}/>
                <NavBarButton text={"Proveedores"} icon={"truck"} onClick={()=>{navigate("/inventory/suppliers")}}/>
                <NavBarButton text={"Reabastecimientos"} icon={"cart-fill"} onClick={()=>{navigate("/inventory/restocks")}}/>
            </div>
        </div>
    );
}