import { NextResponse } from "next/server";
import { findRouteConfig, modules } from "./lib/modules";
import {
  getTokenFromCookies,
  getRefreshTokenFromCookies,
  isTokenExpired,
  shouldRefreshToken,
  decodeToken,
} from "./lib/auth";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;

  console.log("🛡️ Middleware ejecutándose para:", pathname);

  // Rutas completamente públicas (sin autenticación)
  const publicApiRoutes = ["/api/auth/login", "/api/auth/refresh"];
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verificar si es una ruta de módulo válida
  const routeConfig = findRouteConfig(pathname);

  if (!routeConfig) {
    console.log("❓ Ruta no encontrada en módulos");
  } else {
    console.log("🎯 Ruta encontrada:", {
      path: routeConfig.route.path,
      requiresAuth: routeConfig.route.requiresAuth,
      requiresAdmin: routeConfig.route.requiresAdmin,
    });
  }

  // Determinar si la ruta requiere autenticación basado en la configuración
  const requiresAuth = routeConfig?.route?.requiresAuth;
  const requiresAdmin = routeConfig?.route?.requiresAdmin;

  console.log(
    "📊 Requiere auth:",
    requiresAuth,
    "| Requiere admin:",
    requiresAdmin,
  );

  // Manejar rutas que requieren autenticación
  if (requiresAuth) {
    const accessToken = getTokenFromCookies(request.cookies);
    console.log("🔑 accessToken:", accessToken);
    const refreshToken = getRefreshTokenFromCookies(request.cookies);

    // Si no hay token de acceso, redirigir a login
    if (!accessToken) {
      console.log("❌ No hay token, redirigiendo a /auth");
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // Si el token está expirado
    if (isTokenExpired(accessToken)) {
      // Intentar refrescar con refresh token
      if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const refreshResponse = await fetch(
            new URL("/api/auth/refresh", request.url),
            {
              method: "POST",
              headers: {
                Cookie: request.headers.get("cookie") || "",
              },
              credentials: "include",
            },
          );

          if (refreshResponse.ok) {
            // Token refrescado exitosamente, continuar con la petición
            const response = NextResponse.next();

            // Copiar las cookies de la respuesta del refresh
            const setCookieHeaders = refreshResponse.headers.getSetCookie();
            setCookieHeaders.forEach((cookie) => {
              response.headers.append("Set-Cookie", cookie);
            });

            return response;
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }

      // Si no se pudo refrescar el token, redirigir a login
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // Si el token está próximo a expirar, intentar refrescarlo en background
    if (shouldRefreshToken(accessToken) && refreshToken) {
      try {
        await fetch(new URL("/api/auth/refresh", request.url), {
          method: "POST",
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
          credentials: "include",
        });
      } catch (error) {
        console.error("Background token refresh failed:", error);
      }
    }

    // Si la ruta requiere permisos de admin, verificarlo
    if (requiresAdmin) {
      const decoded = decodeToken(accessToken);

      if (!decoded?.isAdmin) {
        console.log(
          "❌ Usuario sin permisos de admin intentando acceder a:",
          pathname,
        );
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      console.log("✅ Usuario admin accediendo a:", pathname);
    }
  }

  // Manejar rutas que NO requieren autenticación o son APIs públicas
  if (!requiresAuth || isPublicApiRoute) {
    // Si existe en findRouteConfig, es válida
    if (routeConfig) {
      console.log("✅ Ruta pública válida, continuando");
      return NextResponse.next();
    }

    // Si es API pública, permitir
    if (isPublicApiRoute) {
      console.log("✅ API pública, continuando");
      return NextResponse.next();
    }

    // Si no existe, verificar si parece ser un módulo para redirigir a 404
    const potentialModule = pathname.split("/")[1];
    const isLikelyModuleRoute =
      potentialModule &&
      Object.keys(modules).some((module) => pathname.startsWith(`/${module}`));

    if (isLikelyModuleRoute) {
      console.log("❌ Ruta de módulo inválida, redirigiendo a 404");
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  console.log("✅ Continuando con la petición");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
