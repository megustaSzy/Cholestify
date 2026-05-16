import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;

  // [DEV] Auth guard disabled temporarily — uncomment when BE is running
  // if (!token && request.nextUrl.pathname.startsWith("/user")) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
  //   return NextResponse.redirect(new URL("/user/dashboard", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/:path*", "/login", "/signup"],
};
