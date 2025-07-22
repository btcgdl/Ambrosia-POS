import { useEffect, useState } from "react";
import {createInvoice, getInfo, payInvoiceFromService} from "./cashierService";

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

    const dummyTransactions = [
        { id: "tx1", type: "received", amount: 25000, timestamp: "2025-07-21T15:30:00Z" },
        { id: "tx2", type: "sent", amount: 12000, fee: 10, timestamp: "2025-07-20T11:15:00Z" },
        { id: "tx3", type: "received", amount: 50000, timestamp: "2025-07-19T09:00:00Z" }
    ];

    useEffect(() => {
        fetchInfo();
        setTransactions(dummyTransactions);
    }, []);

    const fetchInfo = async () => {
        try {
            const res = await getInfo();
            //if (!res.ok) throw new Error("Error al obtener la información");
            setInfo(res);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Error al obtener la información de la wallet");
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
            setPaymentResult(res)
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

    return (
        <div className="p-8 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Wallet Lightning ⚡</h1>

            {error && <p className="text-red-600">{error}</p>}

            <div className="bg-gray-100 rounded p-4">
                <h2 className="text-2xl mb-2">Información</h2>
                {info ? (
                    <div className="flex flex-col gap-1">
                        <p><b>Node ID:</b> {info.nodeId}</p>
                        <p><b>Versión:</b> {info.version}</p>
                        <p><b>Red:</b> {info.chain}</p>
                        <p><b>Altura de bloque:</b> {info.blockHeight}</p>

                        <p><b>Balance local:</b> {
                            info.channels.reduce((total, ch) => total + ch.balanceSat, 0)
                        } sats</p>

                        <h3 className="mt-2 text-lg font-semibold">Canales abiertos:</h3>
                        {info.channels.map((ch, index) => (
                            <div key={ch.channelId} className="border rounded p-2 mt-1">
                                <p><b>Canal #{index + 1}</b></p>
                                <p><b>Estado:</b> {ch.state}</p>
                                <p><b>Balance:</b> {ch.balanceSat} sats</p>
                                <p><b>Inbound Liquidity:</b> {ch.inboundLiquiditySat} sats</p>
                                <p><b>Capacidad total:</b> {ch.capacitySat} sats</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Cargando información...</p>
                )}
            </div>

            <div className="bg-green-100 rounded p-4">
                <h2 className="text-2xl mb-2">Recibir Pago</h2>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Monto en sats"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        className="p-2 rounded flex-1"
                    />
                    <input
                        type="text"
                        placeholder="Descripción (opcional)"
                        value={invoiceDesc}
                        onChange={(e) => setInvoiceDesc(e.target.value)}
                        className="p-2 rounded flex-1"
                    />
                    <button
                        onClick={handleCreateInvoice}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Creando..." : "Crear Invoice"}
                    </button>
                </div>
                {createdInvoice && (
                    <div className="mt-4 bg-white p-2 rounded space-y-2">
                        <div className="flex items-start gap-2">
                            <p className="font-bold">BOLT11:</p>
                            <div className="flex-1 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                                <span className="select-all">{createdInvoice.serialized}</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(createdInvoice.serialized)}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Copiar
                            </button>
                        </div>

                        <div className="flex items-start gap-2">
                            <p className="font-bold">Hash:</p>
                            <div className="flex-1 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                                <span className="select-all">{createdInvoice.paymentHash}</span>
                            </div>
                            <button
                                onClick={() => copyToClipboard(createdInvoice.paymentHash)}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                            >
                                Copiar
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
                    <p><b>Monto enviado:</b> {paymentResult.recipientAmountSat} sats</p>
                    <p><b>Fee de enrutamiento:</b> {paymentResult.routingFeeSat} sats</p>
                    <p><b>Payment ID:</b> {paymentResult.paymentId}</p>

                    <div className="flex items-start gap-2 mt-2">
                        <p className="font-bold">Hash:</p>
                        <div className="flex-1 overflow-x-auto break-words bg-gray-100 p-1 rounded">
                            <span className="select-all">{paymentResult.paymentHash}</span>
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
                            <span className="select-all">{paymentResult.paymentPreimage}</span>
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

            <div className="bg-gray-100 rounded p-4">
                <h2 className="text-2xl mb-2">Historial</h2>
                {transactions.length === 0 ? (
                    <p>No hay transacciones aún</p>
                ) : (
                    <ul className="divide-y">
                        {transactions.map((tx) => (
                            <li key={tx.id} className="py-2 flex justify-between">
                                <span>
                                    {tx.type === "received" ? "✅ Recibido" : "📤 Enviado"} - {tx.amount} sats
                                </span>
                                <span className="text-gray-500">{new Date(tx.timestamp).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
