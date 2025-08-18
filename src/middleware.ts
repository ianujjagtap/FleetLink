import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/dashboard"
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/vehicle-management", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
