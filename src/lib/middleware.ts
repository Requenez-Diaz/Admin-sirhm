import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authTokens = request.cookies.get("authTokens")?.value;
  console.log("authTokens", authTokens);

  if (request.nextUrl.pathname.startsWith("dashboard/home") && !authTokens) {
    const response = NextResponse.redirect(
      new URL("auth/sign-in", request.url)
    );
    response.cookies.delete("authTokens");
    return response;
  }
  if (authTokens && request.nextUrl.pathname.startsWith("auth/sign-in")) {
    const response = NextResponse.redirect(
      new URL("/dashboard/home", request.url)
    );
    return response;
  }
}
// Estas son las rutas sobre la que actua el middleware
export const config = {
  matcher: ["/auth/sign-in", "/dashboard/home"],
};
