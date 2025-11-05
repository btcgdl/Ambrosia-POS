"use client";
import { createContext, useEffect, useState } from "react";
import { loginFromService, logoutFromService } from "./authService";
import { apiClient } from "../../services/apiClient";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true)

      const data = await apiClient("/users/me")

      setUserInfo(data);
      setIsAuth(true)
      console.log(data)
    } catch (error) {
      setUserInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    fetchUser();
    const handleExpired = () => {
      setUserInfo(null)
      setIsAuth(false);
      router.push("/")
    };

    window.addEventListener("auth:expired", handleExpired);
    return () => window.removeEventListener("auth:expired", handleExpired)
  }, []);

  useEffect(() => {
    if (!isAuth) return;

    const revalidate = () => {
      apiClient("/users/me").catch(() => { });
    };

    const onFocus = () => revalidate();
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") revalidate();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isAuth]);

  const value = {
    userInfo,
    isAuth,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
