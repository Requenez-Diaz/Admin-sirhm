import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isSignInPage = nextUrl.pathname === "/sign-in";
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isApiAuthRoute) return NextResponse.next();

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (isSignInPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/home", nextUrl));
  }

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(
      new URL(isLoggedIn ? "/dashboard/home" : "/sign-in", nextUrl),
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|.*\\..*).*)"],
};
