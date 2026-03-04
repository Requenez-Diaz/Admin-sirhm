"use server";

import { loginSchema } from "@/lib/zod";
import { z } from "zod";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signIn } from "../../../../auth";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Campos inválidos" };
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: "/dashboard/home",
    });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Correo o contraseña incorrectos" };
        case "CallbackRouteError":
          return { error: "Acceso denegado: Solo administradores." };
        default:
          return { error: "Error de autenticación." };
      }
    }

    // 3. OTROS ERRORES
    console.error("Login Error:", error);
    return { error: "Ocurrió un error inesperado." };
  }
};
