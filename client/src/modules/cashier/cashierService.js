import {apiClient} from "../../services/apiClient";
import {mockService} from "../../useMockSocket";

export async function getTurnOpen() {
    try {
        return await apiClient('/get-turn-open');
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