import { auth as middleware } from "../auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/sign-in"];

export default middleware(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiRoute = nextUrl.pathname.startsWith("/api");

  if (nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute && !isApiRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/sign-in", "/"],
};