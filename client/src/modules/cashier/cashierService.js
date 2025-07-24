import {apiClient} from "../../services/apiClient";

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