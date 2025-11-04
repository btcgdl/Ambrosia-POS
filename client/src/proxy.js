import { NextResponse } from 'next/server'

export function proxy(request) {
  const { pathname } = new URL(request.url);

  const isAuthRoute = pathname.startsWith("/auth")
  const isApiRoute = pathname.startsWith("/api")
  const isPublicFile = pathname.startsWith("/_next") || pathname.includes(".")

  if (!isAuthRoute && !isPublicFile && !isApiRoute) {
    const refreshToken = request.cookies.get("refreshToken");
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
}
