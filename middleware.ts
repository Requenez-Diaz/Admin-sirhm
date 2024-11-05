import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

const authRoutes = ["/sign-in"];
const apiAuthPrefix = "/api/auth";

export default auth((req) => {
  const { nextUrl } = req;
  console.log({ nextUrl });

  const isLoggedIn = !!req.auth;
  console.log({ isLoggedIn });

  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    return NextResponse.next();
  }

  if (authRoutes.includes(nextUrl.pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
