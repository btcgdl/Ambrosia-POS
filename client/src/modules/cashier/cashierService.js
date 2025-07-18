import {apiClient} from "../../services/apiClient";
import {mockService} from "../../useMockSocket";

export async function getTurnOpen() {
    try {
        const shifts = await apiClient('/shifts');
        if (!shifts) return;
        const openShift = shifts.find(shift => shift.end_time === null);
        return openShift ? openShift.id : null;
    } catch (error) {
        return { data: mockService.getTurnOpen() };
    }
}

export async function openTurn(){
    try {
        return await apiClient('/shifts', {
            method: 'POST',
            body: {
                user_id: localStorage.getItem('userId'),
                shift_date: Date.now(),
                start_time: Date.now(),
                notes: ""
            }
        });
    } catch (error) {
        console.error(error);
        console.error(error.message);
        throw error;
    }
}

export async function closeTurn(openTurn){
    try {
        const currentShift = await apiClient(`/shifts/${openTurn}`);
        if (!currentShift) throw new Error("Turn not found");
        currentShift.end_time = Date.now();
        return await apiClient(`/shifts/${openTurn}`, {
            method: 'PUT',
            body: currentShift
        })
    } catch (error) {
        throw error;
    }
}

export async function getReport(startDate, endDate) {
    try {
        return await apiClient(`/get-report?startDate=${startDate}&endDate=${endDate}`);
    } catch (error) {
        return {
            data: mockService.getReport(startDate, endDate),
        };
    }
}