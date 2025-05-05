import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";

export default function Table({ tableData }) {
    const navigate = useNavigate();
    const [bgColor, setBgColor] = useState("bg-green-500");
    useEffect(()=>{
        console.log(tableData);
        if (tableData.estado === "libre") setBgColor("bg-green-500");
        else if (tableData.estado === "ocupada") setBgColor("bg-red-500");
    }, [tableData]);

    return (
        <button
            onClick={() => { }}
            className={`h-full w-[200px] min-w-[200px] border-2 border-gray-400 rounded-md flex flex-col items-center justify-center p-4 hover:bg-gray-100 transition-all text-center ${bgColor}`}
        >
            <i className="bi bi-door-open-fill text-4xl mb-2"></i>
            <span className="text-lg font-semibold">{tableData.nombre}</span>
        </button>
    );
}
