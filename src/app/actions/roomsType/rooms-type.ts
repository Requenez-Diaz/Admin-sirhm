"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getTypeBedrooms() {
  try {
    const types = await prisma.typeBedrooms.findMany({
      include: { _count: { select: { Bedrooms: true } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: types };
  } catch (error) {
    return {
      success: false,
      error: "Error al obtener los tipos de habitación",
    };
  }
}

// 2. Crear un nuevo tipo
export async function createTypeBedroom(data: {
  nameType: string;
  description: string;
}) {
  try {
    await prisma.typeBedrooms.create({ data });
    revalidatePath("/dashboard/room-types");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al crear el tipo" };
  }
}

export async function updateTypeBedroom(
  id: number,
  data: { nameType: string; description: string },
) {
  try {
    await prisma.typeBedrooms.update({
      where: { id },
      data: {
        nameType: data.nameType,
        description: data.description,
      },
    });
    revalidatePath("/dashboard/room-types");
    return { success: true };
  } catch (error) {
    console.error("Error al editar:", error);
    return {
      success: false,
      error: "No se pudo actualizar el tipo de habitación.",
    };
  }
}

export async function deleteTypeBedroom(id: number) {
  try {
    await prisma.typeBedrooms.delete({
      where: { id },
    });
    revalidatePath("/dashboard/room-types");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar:", error);
    return {
      success: false,
      error:
        "No se puede eliminar: Hay habitaciones registradas con esta categoría. Primero elimina o cambia esas habitaciones.",
    };
  }
}
