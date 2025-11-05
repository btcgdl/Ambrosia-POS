"use client";
import { addToast } from "@heroui/react";

const API_BASE_URL = "/api";

export async function apiClient(
  endpoint,
  { method = "GET", headers = {}, body, credentials = "include" } = {},
) {
  const makeRequest = async () => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  try {
    let response = await makeRequest();

    if (response.status === 401 && !endpoint.startsWith("/auth/refresh")) {
      const refreshed = await handleTokenRefresh();

      if (refreshed) {
        response = await makeRequest();
      } else {
        throw new Error("AUTH_EXPIRED");
      }
    }

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      await handleHttpError(response.status, endpoint, data);
    }

    return data;

  } catch (error) {
    if (error.message !== "AUTH_EXPIRED" && error.message !== "UNAUTHORIZED") {
      addToast({
        title: "Error",
        description: error.message || "Error de conexión",
        color: "danger",
      });
    }
    throw error;
  }
}

async function handleTokenRefresh() {
  try {
    const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      await performLogout();
      dispatchAuthEvent("auth:expired");
      addToast({
        color: "warning",
        title: "Sesión expirada",
        description: "Vuelve a iniciar sesión.",
      });
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

async function handleHttpError(status, endpoint, data) {
  if (status === 401 || status === 403) {
    if (typeof window !== "undefined" && endpoint.startsWith("/wallet")) {
      dispatchAuthEvent("wallet:unauthorized");
      throw new Error("UNAUTHORIZED"); // Error silencioso
    }

    await performLogout();
    dispatchAuthEvent("auth:expired");

    addToast({
      color: "danger",
      title: "Error",
      description: status === 401 ? "No autenticado" : "No autorizado",
    });

    throw new Error("UNAUTHORIZED");
  }

  const errorMsg = typeof data === "string"
    ? data
    : data?.message || `Error ${status}`;

  throw new Error(errorMsg);
}

async function performLogout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
  }
}

function dispatchAuthEvent(eventName, detail = null) {
  if (typeof window !== "undefined") {
    const event = detail
      ? new CustomEvent(eventName, { detail })
      : new Event(eventName);
    window.dispatchEvent(event);
  }
}
