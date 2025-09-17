"use client";
import { addToast } from "@heroui/react";

const API_BASE_URL = "/api";
export async function apiClient(
  endpoint,
  { method = "GET", headers = {}, body, credentials = "include" } = {},
) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = res.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        try {
          if (typeof window !== "undefined" && String(endpoint).startsWith("/wallet")) {
            window.dispatchEvent(new CustomEvent("wallet:unauthorized"));
            // Silenciar toast para wallet y permitir que el guard maneje la UX
            return;
          }
        } catch (_) {}
        addToast({
          color: "danger",
          title: "Error",
          description: res.status === 401 ? "No autenticado" : "Usuario no autorizado",
        });
        return;
      }
      const errorMsg =
        typeof data === "string" ? data : data?.message || "Error desconocido";
      console.log(errorMsg);
      addToast({
        color: "danger",
        title: "Error",
        description: errorMsg,
      });
      throw new Error(errorMsg);
    }

    //if (showLog) showLog("success", "Operación exitosa");
    return data;
  } catch (err) {
    addToast({
      title: "Error",
      description: err.message,
      color: "danger",
    });
    throw err;
  }
}
