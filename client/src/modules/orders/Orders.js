import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Header from "../../components/header/Header";
import { createOrder, getAllOrders, getUserById } from "./ordersService";
import PaginatedTable from "../../components/PaginatedTable";
import formatDate from "../../utils/formatDate";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("en-curso");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getAllOrders();
        setOrders(response);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchData();
  }, []);

  const handleOrderClick = (pedidoId) => {
    navigate(`/modify-order/${pedidoId}`);
  };

  const handleCreateOrder = async () => {
    try {
      const createdOrderId = await createOrder();
      navigate(`/modify-order/${createdOrderId.id}`);
    } catch (error) {
    } finally {
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "en-curso") {
      return order.status === "open" || order.status === "closed";
    }
    return order.status === "paid";
  });

  const columns = [
    {
      key: "id",
      title: "ID",
      width: "120px",
      className: "font-mono text-sm text-gray-900",
      render: (value) => value.substring(0, 4),
    },
    {
      key: "waiter",
      title: "Mesero",
      className: "text-gray-900 font-medium",
    },
    {
      key: "table_id",
      title: "Mesa",
      width: "120px",
      className: "text-gray-500",
      render: (value) =>
        value ? (
          value.substring(0, 4)
        ) : (
          <span className="text-gray-400 italic">Sin mesa</span>
        ),
    },
    {
      key: "status",
      title: "Estado",
      width: "100px",
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "open"
              ? "bg-green-100 text-green-800"
              : value === "closed"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value === "open"
            ? "Abierta"
            : value === "closed"
              ? "Cerrada"
              : value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "total",
      title: "Total",
      width: "100px",
      className: "text-gray-900 font-semibold",
      render: (value) => (
        <span className={value > 0 ? "text-green-600" : "text-gray-400"}>
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Fecha Creación",
      width: "140px",
      className: "text-gray-500 text-sm",
      render: (value) => formatDate(value),
    },
  ];

  return (
    <main className="h-[95%] w-[95%] mt-6 mx-auto my-auto overflow-y-auto">
      <div className=" bg-amber-200 rounded-lg p-6 flex flex-col ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Lista de Órdenes</h2>
          <button
            className="w-16 h-16 bg-green-500 text-white text-3xl rounded-full flex items-center justify-center hover:bg-green-600"
            onClick={handleCreateOrder}
          >
            +
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className={`py-4 px-8 text-2xl rounded-lg ${
              filter === "en-curso"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("en-curso")}
          >
            En curso
          </button>
          <button
            className={`py-4 px-8 text-2xl rounded-lg ${
              filter === "pagados"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setFilter("pagados")}
          >
            Pagados
          </button>
        </div>

        <PaginatedTable
          data={filteredOrders}
          columns={columns}
          initialItemsPerPage={5}
          itemsPerPageOptions={[5, 10, 15, 20]}
          rowClickable
          emptyMessage="No hay ordenes disponibles"
          onRowClick={(orderData) => handleOrderClick(orderData.id)}
        />
      </div>
    </main>
  );
}
