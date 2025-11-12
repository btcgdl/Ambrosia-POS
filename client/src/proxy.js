
import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = new URL(request.url);
  const refreshToken = request.cookies.get("refreshToken");

  const isAuthRoute = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isPublicFile =
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  if (!isAuthRoute && !isPublicFile && !isApiRoute) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

