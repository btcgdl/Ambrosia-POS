import {apiClient} from "../../services/apiClient";
import {mockService} from "../../useMockSocket";

export async function getTurnOpen() {
    try {
        return await apiClient('/get-turn-open', {credentials : "same-origin"});
    } catch (error) {
        return { data: mockService.getTurnOpen() };
    }
}

export async function setTurnOpen(open){
    try {
        return await apiClient('/set-turn-open');
    } catch (error) {
        return { data: mockService.setTurnOpen(open) };
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