// src/app/actions/role/saveRole.ts

"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"; // Importar el tipo de error

export default async function saveRole(formData: FormData) {
  try {
    const rawFormRole = Object.fromEntries(formData);

    if (!prisma || !prisma.role) {
      throw new Error("Prisma client or role model is not defined");
    }

    const role = await prisma.role.create({
      data: {
        roleName: String(rawFormRole.roleName),
        descript: String(rawFormRole.descript),
      },
    });

    revalidatePath("/roles");
    return { success: true, role };
  } catch (error) {
    console.error("Error saving role:", error);

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      // Error de violación de restricción única
      return {
        success: false,
        message: "El nombre de rol ya existe. Por favor, elige uno diferente.",
      };
    }

    // Otros errores
    return {
      success: false,
      message: "Ocurrió un error desconocido al guardar el rol.",
    };
  }
}
