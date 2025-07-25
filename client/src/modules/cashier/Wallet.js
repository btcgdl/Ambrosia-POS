import { useEffect, useState } from "react";
import {
  createInvoice,
  getIncomingTransactions,
  getInfo,
  getOutgoingTransactions,
  payInvoiceFromService,
} from "./cashierService";
import QRCode from "react-qr-code";
import Tabs from "../../components/Tabs";

export default function Wallet() {
  const [info, setInfo] = useState(null);
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDesc, setInvoiceDesc] = useState("");
  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [payInvoice, setPayInvoice] = useState("");
  const [paymentResult, setPaymentResult] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // 'incoming' | 'outgoing' | 'all'

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchInfo = async () => {
    try {
      const res = await getInfo();
      setInfo(res);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al obtener la información de la wallet");
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let incoming = [];
      let outgoing = [];

      if (filter === "incoming" || filter === "all") {
        incoming = await getIncomingTransactions();
      }
      if (filter === "outgoing" || filter === "all") {
        outgoing = await getOutgoingTransactions();
      }

      const allTx = [...incoming, ...outgoing].sort(
        (a, b) => b.completedAt - a.completedAt,
      );
      setTransactions(allTx);
    } catch (err) {
      console.error("Error al obtener transacciones:", err);
      setError("Error al cargar historial");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!invoiceAmount) {
      setError("Debes ingresar un monto para la invoice");
      return;
    }
    try {
      setLoading(true);
      const res = await createInvoice(invoiceAmount, invoiceDesc);
      setCreatedInvoice(res);
      setInvoiceAmount("");
      setInvoiceDesc("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al crear la invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async () => {
    if (!payInvoice.trim()) {
      setError("Debes ingresar una invoice para pagar");
      return;
    }
    try {
      setLoading(true);
      const res = await payInvoiceFromService(payInvoice);
      setPaymentResult(res);
      setPayInvoice("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Error al pagar la invoice");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        alert("✅ Copiado al portapapeles");
      } catch (err) {
        console.error("Error al copiar con clipboard API", err);
        fallbackCopy(text);
      }
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      alert("✅ Copiado al portapapeles");
    } catch (err) {
      console.error("Fallback copy failed", err);
      alert("❌ No se pudo copiar");
    }
    document.body.removeChild(textarea);
  };

  const tabsData = [
    {
      label: "Recibir Pago",
      content: (
        <div className="bg-green-100 rounded p-4 overflow-y-auto">
          <h2 className="text-2xl mb-2">Recibir Pago</h2>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Monto en sats"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(e.target.value)}
              className="p-2 rounded flex-1"
              required={true}
            />
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={invoiceDesc}
              onChange={(e) => setInvoiceDesc(e.target.value)}
              className="p-2 rounded flex-1"
              required={true}
            />
            <button
              onClick={() => {
                handleCreateInvoice();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear Invoice"}
            </button>
          </div>
          {createdInvoice && (
            <div className="flex gap-2 mt-4">
              <div className="bg-white p-2 rounded flex items-center justify-center flex-shrink-0">
                <QRCode value={createdInvoice.serialized} />
              </div>
              <div className="bg-white p-2 rounded space-y-2 flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <p className="font-bold whitespace-nowrap">BOLT11:</p>
                  <div className="flex-1 min-w-0 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                    <span className="select-all text-sm">
                      {createdInvoice.serialized}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdInvoice.serialized)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap flex-shrink-0"
                  >
                    Copiar
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <p className="font-bold whitespace-nowrap">Hash:</p>
                  <div className="flex-1 min-w-0 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                    <span className="select-all text-sm">
                      {createdInvoice.paymentHash}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(createdInvoice.paymentHash)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm whitespace-nowrap flex-shrink-0"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "Enviar Pago",
      content: (
        <>
          <div className="bg-blue-100 rounded p-4">
            <h2 className="text-2xl mb-2">Enviar Pago</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="BOLT11 Invoice"
                value={payInvoice}
                onChange={(e) => setPayInvoice(e.target.value)}
                className="p-2 rounded flex-1"
              />
              <button
                onClick={handlePayInvoice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Pagando..." : "Pagar"}
              </button>
            </div>
          </div>
          {paymentResult && (
            <div className="mt-4 bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2">✅ Pago realizado</h3>
              <p>
                <b>Monto enviado:</b> {paymentResult.recipientAmountSat} sats
              </p>
              <p>
                <b>Fee de enrutamiento:</b> {paymentResult.routingFeeSat} sats
              </p>
              <p>
                <b>Payment ID:</b> {paymentResult.paymentId}
              </p>

              <div className="flex items-start gap-2 mt-2">
                <p className="font-bold">Hash:</p>
                <div className="flex-1 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                  <span className="select-all">
                    {paymentResult.paymentHash}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentResult.paymentHash)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Copiar
                </button>
              </div>

              <div className="flex items-start gap-2 mt-2">
                <p className="font-bold">Preimage:</p>
                <div className="flex-1 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                  <span className="select-all">
                    {paymentResult.paymentPreimage}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(paymentResult.paymentPreimage)}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      label: "Historial",
      content: (
        <div className="bg-gray-100 rounded p-4">
          <h2 className="text-2xl mb-2">Historial</h2>
          <div className="flex gap-2 mb-4">
            <button
              className={`px-4 py-1 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
              onClick={() => setFilter("all")}
            >
              Todos
            </button>
            <button
              className={`px-4 py-1 rounded ${filter === "incoming" ? "bg-green-500 text-white" : "bg-gray-300"}`}
              onClick={() => setFilter("incoming")}
            >
              Recibidos
            </button>
            <button
              className={`px-4 py-1 rounded ${filter === "outgoing" ? "bg-red-500 text-white" : "bg-gray-300"}`}
              onClick={() => setFilter("outgoing")}
            >
              Enviados
            </button>
          </div>
          {transactions.length === 0 ? (
            <p>No hay transacciones aún</p>
          ) : (
            <ul className="divide-y">
              {transactions.map((tx, i) => (
                <li key={tx.paymentId || tx.txId || i} className="py-2">
                  <div className="flex justify-between items-center">
                    <div>
                      {tx.type === "outgoing_payment" ? (
                        <span>📤 Enviado - {tx.sent} sats</span>
                      ) : (
                        <span>✅ Recibido - {tx.receivedSat} sats</span>
                      )}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {new Date(tx.completedAt).toLocaleString()}
                    </div>
                  </div>
                  {
                    <p className="text-sm text-gray-500">
                      Fee: {Number(tx.fees) / 1000} sats
                    </p>
                  }
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
  ];

  return (
    <main className="h-[90%] w-[90%] mt-4 mx-auto my-auto overflow-y-auto">
      <div className="bg-amber-100 rounded-xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Wallet Lightning ⚡</h1>

        {error && <p className="text-red-600">{error}</p>}

        <div className="bg-white rounded p-4">
          <h2 className="text-2xl mb-2">Información</h2>
          {info ? (
            <div className="flex flex-col gap-1 overflow-x-auto">
              <p>
                <b>Node ID:</b> {info.nodeId}
              </p>
              <p>
                <b>Versión:</b> {info.version}
              </p>
              <p>
                <b>Red:</b> {info.chain}
              </p>
              <p>
                <b>Altura de bloque:</b> {info.blockHeight}
              </p>

              <p>
                <b>Balance local:</b>{" "}
                {info.channels.reduce((total, ch) => total + ch.balanceSat, 0)}{" "}
                sats
              </p>

              <h3 className="mt-2 text-lg font-semibold">Canales abiertos:</h3>
              {info.channels.map((ch, index) => (
                <div key={ch.channelId} className="border rounded p-2 mt-1">
                  <p>
                    <b>Canal #{index + 1}</b>
                  </p>
                  <p>
                    <b>Estado:</b> {ch.state}
                  </p>
                  <p>
                    <b>Balance:</b> {ch.balanceSat} sats
                  </p>
                  <p>
                    <b>Inbound Liquidity:</b> {ch.inboundLiquiditySat} sats
                  </p>
                  <p>
                    <b>Capacidad total:</b> {ch.capacitySat} sats
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Cargando información...</p>
          )}
        </div>

        <Tabs tabs={tabsData} />
      </div>
    </main>
  );
}
