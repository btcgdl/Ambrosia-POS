import { NextResponse } from "next/server";
import { findRouteConfig } from "./lib/modules";

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  // Verificar si es una ruta de módulo
  const routeConfig = findRouteConfig(pathname);

  if (routeConfig) {
    // La ruta existe, permitir acceso
    return NextResponse.next();
  }

  // Si es una ruta de módulo pero no válida, redirigir
  const moduleRoutes = ["auth", "inventory", "sales"];
  const isModuleRoute = moduleRoutes.some((module) =>
    pathname.startsWith(`/${module}`),
  );

  if (isModuleRoute) {
    return NextResponse.redirect(new URL("/404", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
