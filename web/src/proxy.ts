import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage = pathname.startsWith("/user");

  const hasAuthCookie = Boolean(accessToken || refreshToken);

  if (!hasAuthCookie && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasAuthCookie && isAuthPage) {
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/login", "/signup"],
};
