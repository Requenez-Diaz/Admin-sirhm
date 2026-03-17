import prisma from "@/lib/db";
import { loginSchema } from "@/lib/zod";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);
        if (!success) return null;

        const user = await prisma.user.findUnique({
          where: { email: data.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) return null;

        if (user.roleName !== "Admin") return null;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          role: user.roleName,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
