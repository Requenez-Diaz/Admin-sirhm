import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,

  session: { strategy: "jwt" },
  callbacks: {
    //TODO: jwt se ejecuta cada vez que se crea un token
    //TODO: se puede agregar informacion adicional al token
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      console.log(token);
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  // pages: {
  //   signIn: "/login",
  // },
});
