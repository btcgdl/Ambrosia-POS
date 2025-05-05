import { createContext, useContext } from "react";
import { useMockSocket } from "../testing/useMockSocket";

const MockSocketContext = createContext(null);

export function MockSocketProvider({ children }) {
    const mockSocket = useMockSocket();
    return (
        <MockSocketContext.Provider value={mockSocket}>
            {children}
        </MockSocketContext.Provider>
    );
}

export function useMock() {
    return useContext(MockSocketContext);
}
