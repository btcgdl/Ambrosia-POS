import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {createOrder} from "../../modules/orders/ordersService";
import {updateTable} from "../../modules/spaces/spacesService";

export default function TableCard({ tableData }) {
    const navigate = useNavigate();
    const [bgColor, setBgColor] = useState("");

    useEffect(() => {
        if (tableData.status === "available") {
            setBgColor("bg-green-500");
        } else if (tableData.status === "occupied") {
            setBgColor("bg-red-500");
        }
    }, [tableData]);

    async function tableClicked (){
        if (tableData.status === "available") {
            console.log(tableData.id);
            const orderResponse = await createOrder(tableData.id);
            console.log(orderResponse.id);
            if (orderResponse.id) {
                tableData.order_id = orderResponse.id;
                tableData.status = "occupied"
                await updateTable(tableData);
            }
            navigate(`/modify-order/${orderResponse.id}`);
        } else if(tableData.status === "occupied") {
            navigate(`/modify-order/${tableData.order_id}`);
        }
    }

    return (
        <button
            onClick={tableClicked}
            className={`h-full w-[200px] min-w-[200px] border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-all text-center ${bgColor}`}
        >
            <i className="bi bi-microsoft text-4xl mb-2"></i>
            <span className="text-lg font-semibold">{tableData.name}</span>
        </button>
    );
}