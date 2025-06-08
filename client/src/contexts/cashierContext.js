// src/context/ApiValueContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";
import { mockService } from "../useMockSocket";

const ApiValueContext = createContext();

export const CashierProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashierOpen = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/cashier/status");
        setIsOpen(response.data.isOpen);
      } catch (error) {
        setIsOpen(mockService.getCashierOpen());
      } finally {
        setLoading(false);
      }
    };
    fetchCashierOpen();
  }, []);

  return (
    <ApiValueContext.Provider value={{ isOpen, loading }}>
      {children}
    </ApiValueContext.Provider>
  );
};

export const useApiValue = () => useContext(ApiValueContext);
