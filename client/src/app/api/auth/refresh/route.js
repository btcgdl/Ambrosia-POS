import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://${process.env.HOST}:${process.env.NEXT_PUBLIC_PORT_API}`;

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token found" },
        { status: 401 },
      );
    }

    // Hacer la petición al backend para refrescar el token
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.text();
      return NextResponse.json(
        { message: errorData || "Token refresh failed" },
        { status: response.status },
      );
    }

    const data = await response.json();

    // Crear la respuesta exitosa
    const nextResponse = NextResponse.json(
      { message: "Token refreshed successfully" },
      { status: 200 },
    );

    // Establecer las nuevas cookies si vienen en la respuesta
    if (data.accessToken) {
      nextResponse.cookies.set("accessToken", data.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 60, // 1 minuto
        path: "/",
      });
    }

    if (data.refreshToken) {
      nextResponse.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 días
        path: "/",
      });
    }

    // Copiar cookies adicionales de la respuesta del backend si las hay
    const setCookieHeaders = response.headers.getSetCookie?.();
    if (setCookieHeaders) {
      setCookieHeaders.forEach((cookie) => {
        const [cookieStr] = cookie.split(";");
        const [name, value] = cookieStr.split("=");
        if (
          name &&
          value &&
          !["accessToken", "refreshToken"].includes(name.trim())
        ) {
          nextResponse.cookies.set(name.trim(), value.trim());
        }
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("Refresh token error:", error);

    const errorResponse = NextResponse.json(
      { message: "Internal server error during token refresh" },
      { status: 500 },
    );

    // Limpiar cookies en caso de error
    errorResponse.cookies.delete("accessToken");
    errorResponse.cookies.delete("refreshToken");

    return errorResponse;
  }
}
