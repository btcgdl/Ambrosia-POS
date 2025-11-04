"use client";
import { createContext } from "react";
import { logoutFromService } from "./authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const logout = async () => {
    await logoutFromService();
  };

  const value = {
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
