"use client";
import { createContext, useState } from "react";
import { loginFromService, logoutFromService } from "./authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const login = async ({ name, pin }) => {
    try {
      setIsLoading(true)
      const loginResponse = await loginFromService(
        { name, pin }
      )

      setUserInfo(loginResponse.user);
      setIsAuth(true)
      setIsLoading(false)

    } catch (error) {
      console.log("Login Error", error)
      throw error;
    }
  }
  const logout = async () => {
    await logoutFromService();
    setUserInfo(null);
    setIsAuth(false);
  };

  const value = {
    userInfo,
    isAuth,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
