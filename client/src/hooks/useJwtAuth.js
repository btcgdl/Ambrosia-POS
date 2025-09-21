"use client";
import { useState, useEffect, useCallback } from "react";

export function useJwtAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTokens = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Error refreshing tokens:", error);
      return false;
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setIsAuthenticated(true);
        return true;
      }
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } catch (e) {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    await loadUser();
    setIsLoading(false);
  }, [loadUser]);

  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(() => {
      // Actualiza el usuario periódicamente para mantener estado fresco
      loadUser();
    }, 60000);
    return () => clearInterval(interval);
  }, [checkAuthStatus, loadUser]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    refreshTokens,
    logout,
    checkAuthStatus,
  };
}
