"use client";
import React, { createContext, useEffect, useRef } from "react";
import { logoutFromService } from "./authService";
import { useJwtAuth } from "../../hooks/useJwtAuth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const intervalRef = useRef(null);
  const jwtAuth = useJwtAuth();

  const refreshToken = async () => {
    try {
      // const response = await RefreshToken();
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

    // Refresh cada 1 minuto (simple y predecible)
    intervalRef.current = setInterval(() => {
      refreshToken();
    }, 50000); // 50 segundos

    console.log("⏱️ Token refresher iniciado cada 50 segundos");
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
    // También activar el sistema JWT
    jwtAuth.checkAuthStatus();
  };

  const logout = async () => {
    stopTokenRefresh();
    // También limpiar el sistema JWT
    await logoutFromService();
    jwtAuth.logout();
  };

  useEffect(() => {
    return () => {
      stopTokenRefresh();
    };
  }, []);

  const value = {
    login,
    logout,
    // Exponer funcionalidades JWT
    user: jwtAuth.user,
    isAuthenticated: jwtAuth.isAuthenticated,
    isLoading: jwtAuth.isLoading,
    refreshTokens: jwtAuth.refreshTokens,
    checkAuthStatus: jwtAuth.checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
