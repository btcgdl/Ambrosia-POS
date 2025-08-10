"use client";
import React, { createContext, useEffect, useRef } from "react";
import { RefreshToken } from "./authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const intervalRef = useRef(null);

  const refreshToken = async () => {
    try {
      const response = await RefreshToken();
    } catch (err) {
      console.error("Error en la petición de refresh:", err);
      logout();
    }
  };

  const startTokenRefresh = () => {
    if (intervalRef.current) {
      console.warn("Refresh ya estaba activo");
      return;
    }

    refreshToken();

    intervalRef.current = setInterval(() => {
      refreshToken();
    }, 298000);

    console.log("⏱️ Token refresher iniciado");
  };

  const stopTokenRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("Token refresher detenido");
    }
  };

  const login = () => {
    startTokenRefresh();
  };

  const logout = () => {
    stopTokenRefresh();
  };

  useEffect(() => {
    return () => {
      stopTokenRefresh();
    };
  }, []);

  const value = {
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
