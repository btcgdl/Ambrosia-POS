"use client";
import { useState, useEffect, useCallback } from "react";
import { decodeToken, isTokenExpired, shouldRefreshToken } from "../lib/auth";
import { getCookieValue } from "../modules/auth/authService";

export function useJwtAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAccessToken = useCallback(() => {
    return getCookieValue("accessToken");
  }, []);

  const getRefreshToken = useCallback(() => {
    return getCookieValue("refreshToken");
  }, []);

  const refreshTokens = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return false;
    }
  }, []);

  const validateAndRefreshToken = useCallback(async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken) {
      setIsAuthenticated(false);
      localStorage.clear;
      setUser(null);
      return false;
    }

    // Si el token está expirado
    if (isTokenExpired(accessToken)) {
      if (refreshToken && !isTokenExpired(refreshToken)) {
        const refreshed = await refreshTokens();
        if (refreshed) {
          const newAccessToken = getAccessToken();
          if (newAccessToken) {
            const decoded = decodeToken(newAccessToken);
            setUser(decoded);
            setIsAuthenticated(true);
            return true;
          }
        }
      }

      setIsAuthenticated(false);
      setUser(null);
      return false;
    }

    // Si el token está próximo a expirar, refrescarlo en background
    if (shouldRefreshToken(accessToken) && refreshToken) {
      refreshTokens(); // No esperamos la respuesta
    }

    const decoded = decodeToken(accessToken);
    setUser(decoded);
    setIsAuthenticated(true);
    return true;
  }, [getAccessToken, getRefreshToken, refreshTokens]);

  const logout = useCallback(() => {
    document.cookie =
      "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    await validateAndRefreshToken();
    setIsLoading(false);
  }, [validateAndRefreshToken]);

  useEffect(() => {
    checkAuthStatus();

    // Verificar cada minuto (simple y sin ciclos)
    const interval = setInterval(() => {
      const accessToken = getAccessToken();
      if (!accessToken) return;

      const decoded = decodeToken(accessToken);
      if (!decoded?.exp) return;

      const now = Math.floor(Date.now() / 1000);
      const timeToExpiry = decoded.exp - now;

      // Si quedan menos de 2 minutos, refrescar
      if (timeToExpiry <= 120) {
        console.log(`🔄 Refrescando token (expira en ${timeToExpiry}s)`);
        validateAndRefreshToken();
      }
    }, 60000); // Cada minuto

    return () => clearInterval(interval);
  }, [checkAuthStatus, validateAndRefreshToken, getAccessToken]);

  // Listener para cambios en el localStorage/cookies
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [checkAuthStatus]);

  return {
    user,
    isAuthenticated,
    isLoading,
    refreshTokens,
    logout,
    checkAuthStatus,
    getAccessToken,
    getRefreshToken,
  };
}
