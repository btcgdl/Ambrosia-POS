import {apiClient} from "../../services/apiClient";
import {getPaymentByTicketId} from "../orders/ordersService";

export async function getTurnOpen() {
    const shifts = await apiClient('/shifts');
    if (!shifts) return;
    const openShift = shifts.find(shift => shift.end_time === null);
    return openShift ? openShift.id : null;
}

export async function openTurn(){
    return await apiClient('/shifts', {
        method: 'POST',
        body: {
            user_id: localStorage.getItem('userId'),
            shift_date: Date.now(),
            start_time: Date.now(),
            notes: ""
        }
    });
}

export async function closeTurn(openTurn){
    const currentShift = await apiClient(`/shifts/${openTurn}`);
    if (!currentShift) throw new Error("Turn not found");
    currentShift.end_time = Date.now();
    return await apiClient(`/shifts/${openTurn}`, {
        method: 'PUT',
        body: currentShift
    })
}

export async function getReport(startDate, endDate) {
    return await apiClient(`/get-report?startDate=${startDate}&endDate=${endDate}`);
}

export async function getInfo(){
    return await apiClient('/wallet/getinfo');
}

export async function createInvoice(invoiceAmount, invoiceDesc){
    return await apiClient("/wallet/createinvoice", {
        method: "POST",
        body: {
            description: invoiceDesc,
            amountSat: parseInt(invoiceAmount),
        }
    });
}

export async function payInvoiceFromService(invoice){
    return await apiClient("/wallet/payinvoice", {
        method: "POST",
        body: { invoice: invoice.trim() }
    });
}

export async function getIncomingTransactions() {
    const transactions = await apiClient("/wallet/payments/incoming");
    return transactions ? transactions : [];
}
export async function getOutgoingTransactions() {
    const transactions = await apiClient("/wallet/payments/outgoing");
    return transactions ? transactions : [];
}

//beto y jordy ctm

export async function generateReportFromData(startDate, endDate, {
    tickets,
    orders,
    payments,
    paymentMethods,
}) {
    const start = parseLocalDate(startDate, true);
    const end = parseLocalDate(endDate, false);

    const filteredTickets = tickets.filter(ticket => {
        const ticketDate = new Date(Number(ticket.ticket_date));
        /*console.log(start);
        console.log(end);
        console.log(ticketDate);*/
        return ticketDate >= start && ticketDate <= end;
    });

    const reportsByDate = {};

    for (const ticket of filteredTickets) {
        const date = formatTimeStamp(ticket.ticket_date);

        const order = orders.find(o => o.id === ticket.order_id);
        const userName = order?.waiter || "Desconocido";

        const ticketPayment = await getPaymentByTicketId(ticket.id);
        const payment = payments.find(p => p.id === ticketPayment[0].payment_id);
        const paymentMethodName = paymentMethods.find(method => method.id === payment.method_id).name;
        console.log(paymentMethodName);

        console.log(payment);

        const ticketInfo = {
            amount: ticket.total_amount,
            paymentMethod: paymentMethodName,
            userName,
        };

        if (!reportsByDate[date]) {
            reportsByDate[date] = {
                date,
                balance: 0,
                tickets: [],
            };
        }

        reportsByDate[date].balance += ticket.total_amount;
        reportsByDate[date].tickets.push(ticketInfo);
    }

    const reports = Object.values(reportsByDate);
    const totalBalance = reports.reduce((sum, r) => sum + r.balance, 0);

    return {
        startDate,
        endDate,
        totalBalance,
        reports,
    };
}

function parseLocalDate(dateStr, isStart = true) {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day, isStart ? 0 : 23, isStart ? 0 : 59, isStart ? 0 : 59, isStart ? 0 : 999);
}

function formatTimeStamp(timestamp) {
    const date = new Date(Number(timestamp));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}