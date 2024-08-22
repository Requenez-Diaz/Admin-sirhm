"use server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export default async function updateRole(formData: FormData) {
  const roleId = formData.get("roleId");

  const roleName = formData.get("roleName");
  const descript = formData.get("descript");

  if (!roleId) {
    throw new Error("El ID del rol es requerido");
  } else if (!roleName) {
    throw new Error("El nombre del rol es requerido");
  }

  try {
    const existingRole = await prisma.role.findUnique({
      where: { id: parseInt(roleId as string) },
    });

    if (!existingRole) {
      throw new Error("El rol no existe");
    } else {
      console.log("Rol encontrado:", existingRole);
    }

    const updatedRole = await prisma.role.update({
      where: { id: parseInt(roleId as string) },
      data: {
        roleName: roleName as string,
        descript: descript as string,
      },
    });

    return updatedRole;
  } catch (error) {
    console.error("Error al actualizar el rol: ", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Error de base de datos: ${error.message}`);
    } else {
      throw new Error("Error al actualizar el rol");
    }
  }
}
