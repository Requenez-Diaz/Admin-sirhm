// src/middleware.ts
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = ["/sign-in"];

export default middleware(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard/home", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/sign-in", "/"],
};
