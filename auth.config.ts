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
          throw new Error("Credenciales incorrectas");
        }

        // Buscar usuario en la BD
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
          include: {
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        // Validar contraseña
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        // ⚠️ Restricción de roles (si aplica)
        if (user.roleName !== "Admin") {
          throw new Error("Usuario no autorizado");
        }

        // ✅ IMPORTANTE: convertir id numérico a string
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
