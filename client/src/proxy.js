import { NextResponse } from "next/server";

export default async function proxy(request) {
  const { pathname } = new URL(request.url);
  const refreshToken = request.cookies.get("refreshToken");

  console.log("middleware running");
  const isAuthRoute = pathname.startsWith("/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isPublicFile =
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico";

  if (isApiRoute || isPublicFile) {
    return NextResponse.next();
  }

  let setupIncomplete = false;
  try {
    const headers = { cookie: request.headers.get("cookie") || "" };
    const urls = [
      new URL("/api/initial-setup", request.url),
      new URL("/api/inital-setup", request.url),
    ];
    let evaluated = false;
    for (const url of urls) {
      const res = await fetch(url, { headers });
      if (res.status === 409) {
        setupIncomplete = false;
        evaluated = true;
        break;
      }
      if (res.ok) {
        const data = await res.json();
        setupIncomplete = data?.initialized === false;
        evaluated = true;
        break;
      }
    }
    if (!evaluated) {
      setupIncomplete = false;
    }
  } catch (_) {
    setupIncomplete = false;
  }

  if (setupIncomplete && !isOnboardingRoute) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (!setupIncomplete && isOnboardingRoute) {
    return NextResponse.redirect(
      new URL(refreshToken ? "/" : "/auth", request.url),
    );
  }

  if (!isAuthRoute && !isOnboardingRoute) {
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
