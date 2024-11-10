import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "../auth.config";

const { auth: middleware } = NextAuth(authConfig);

const authRoutes = ["/sign-in"];

export default middleware(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log({ isLoggedIn, path: nextUrl.pathname });

  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    if (nextUrl.pathname === "/dashboard/home") {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
  }

  if (!isLoggedIn && !authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/dashboard/home/:path*",
    "/dashboard/users:path*",
    "/dashboard/bedrooms:path*",
    "/dashboard/bookings/:path*",
    "/dashboard/roles/:path*",
    "/api/:path*",
  ],
};
