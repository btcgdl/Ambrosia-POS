import { createContext, useContext, useState, useEffect, useRef } from "react";
import { setLogger } from "../utils/loggerStore";

const LoggerContext = createContext();

export const useLogger = () => useContext(LoggerContext);

export const LoggerProvider = ({ children }) => {
    const [log, setLog] = useState(null);
    const timeoutRef = useRef(null);

    const showLog = (type, message) => {
        if (type === "endLoading") {
            clearTimeout(timeoutRef.current);
            setLog(null);
            return;
        }

        clearTimeout(timeoutRef.current);

        setLog({ type, message });

        timeoutRef.current = setTimeout(() => {
            setLog(null);
        }, 4000);
    };

    useEffect(() => {
        setLogger(showLog);
        return () => clearTimeout(timeoutRef.current);
    }, []);

    return (
        <LoggerContext.Provider value={{ showLog }}>
            {children}
            {log && (
                <div
                    className={`fixed bottom-4 left-4 px-4 py-2 rounded shadow-lg text-white ${
                        log.type === "error"
                            ? "bg-red-600"
                            : log.type === "loading"
                                ? "bg-blue-600"
                                : "bg-green-600"
                    }`}
                >
                    {log.message}
                </div>
            )}
        </LoggerContext.Provider>
    );
};
