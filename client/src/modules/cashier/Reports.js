﻿import { useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";

import { useNavigate } from "react-router-dom";
import {getOrders, getPaymentMethods, getPayments, getTickets} from "../orders/ordersService";
import {generateReportFromData} from "./cashierService";

export default function Reports() {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  };



  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");

    if (!startDate || !endDate) {
      setError("Debes seleccionar ambas fechas");
      setLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("La fecha de inicio no puede ser mayor a la fecha final");
      setLoading(false);
      return;
    }

    try {
      const report = await generateReportFromData(startDate, endDate, {
        tickets,
        orders,
        payments,
        paymentMethods,
      });
      setReportData(report);
    } catch (err) {
      setError("Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };


  const handleCloseTurn = () => {
    navigate("/close-turn");
  };

  const setQuickDateRange = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [ticketsResponse, ordersResponse, paymentsResponse, paymentMethodsResponse] = await Promise.all([
          getTickets(),
          getOrders(),
          getPayments(),
          getPaymentMethods(),
        ]);

        setTickets(ticketsResponse);
        setOrders(ordersResponse);
        setPaymentMethods(paymentMethodsResponse);
        setPayments(paymentsResponse);

        const report = await generateReportFromData(startDate, endDate, {
          tickets: ticketsResponse,
          orders: ordersResponse,
          payments: paymentsResponse,
          paymentMethods: paymentMethodsResponse,
        });

        setReportData(report);
      } catch (err) {
        console.error(err);
        setError("Error al generar el reporte");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function getPaymentIcon(method) {
    const m = method?.toLowerCase();
    if (m === "efectivo") return "💵";
    if (m === "btc" || m === "bitcoin") return "₿";
    if (m === "tarjeta de débito" || m === "debito") return "🏧";
    if (m === "tarjeta de crédito" || m === "credito") return "💳";
    return "❓";
  }

  return (
    <main className="h-[90%] w-full flex items-center justify-center">
      <div className="h-[90%] w-[90%] bg-amber-100 rounded-xl p-6 flex flex-col gap-6 overflow-y-auto">
        <h2 className="text-4xl font-bold text-center">Reportes de Ventas</h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl text-xl text-center">
            {error}
          </div>
        )}

        {/* Selector de fechas */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-semibold text-center">
              Seleccionar Período
            </h3>

            {/* Botones de acceso rápido */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setQuickDateRange(0)}
                className="bg-blue-100 text-blue-800 text-lg py-3 px-4 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
              >
                📅 Hoy
              </button>
              <button
                onClick={() => setQuickDateRange(7)}
                className="bg-blue-100 text-blue-800 text-lg py-3 px-4 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
              >
                📅 7 días
              </button>
              <button
                onClick={() => setQuickDateRange(30)}
                className="bg-blue-100 text-blue-800 text-lg py-3 px-4 rounded-xl hover:bg-blue-200 transition-colors font-semibold"
              >
                📅 30 días
              </button>
            </div>

            {/* Selectores de fecha */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-center">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xl p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center"
                  disabled={loading}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold text-center">
                  Fecha Final
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xl p-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-center"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              className="bg-green-500 text-white text-2xl py-6 rounded-xl hover:bg-green-600 transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Generando reporte..." : "🔍 Generar Reporte"}
            </button>
          </div>
        </div>

        {/* Resultados del reporte */}
        {reportData && (
          <div className="bg-white rounded-xl p-6 shadow-md flex-1">
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Resumen General</h3>
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-4">
                  <p className="text-xl mb-2">
                    📅 Periodo:{" "}
                    <strong>{formatDate(reportData.startDate)}</strong> -{" "}
                    <strong>{formatDate(reportData.endDate)}</strong>
                  </p>
                </div>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <p className="text-4xl font-bold text-green-600">
                    💰 ${reportData.totalBalance.toFixed(2)}
                  </p>
                  <p className="text-xl text-gray-700 mt-2">Balance Total</p>
                </div>
              </div>

              <div className="grid gap-6">
                {reportData.reports.map((report, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-bold">
                        📆 {report.date}
                      </h4>
                      <div className="bg-green-100 px-4 py-2 rounded-xl">
                        <p className="text-2xl font-bold text-green-700">
                          ${report.balance.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <h5 className="text-xl font-semibold border-b-2 border-amber-300 pb-2">
                        🎫 Tickets del día ({report.tickets.length})
                      </h5>
                      {report.tickets.map((ticket, i) => (
                        <div
                          key={i}
                          className="bg-white p-4 rounded-xl border-2 border-gray-200 flex justify-between items-center"
                        >
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-green-600">
                              ${ticket.amount.toFixed(2)}
                            </span>
                            <span className="text-lg text-gray-600">
                              Por: {ticket.userName}
                            </span>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-4 py-2 rounded-xl text-lg font-bold ${
                                ticket.paymentMethod === "Efectivo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {getPaymentIcon(ticket.paymentMethod)} {ticket.paymentMethod}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botón de cerrar turno */}
        <div className="mt-4">
          <button
            onClick={handleCloseTurn}
            className="w-full bg-red-500 text-white text-3xl py-6 rounded-xl hover:bg-red-600 transition-colors font-bold"
          >
            🔒 Cerrar Turno
          </button>
        </div>
      </div>
    </main>
  );
}
