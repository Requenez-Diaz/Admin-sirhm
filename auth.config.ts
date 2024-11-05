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

        if (!success) {
          throw new Error("Invalid credentials");
        }

        //TODO: verificar si el usuario existe en la base de datos
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
          include: {
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("User not found");
        }

        //TODO: verificar si la contraseña es correcta
        const isValid = await bcrypt.compare(data.password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        console.log(user.roleName);

        return {
          email: user.email,
          name: user.username,
          role: user.roleName,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
