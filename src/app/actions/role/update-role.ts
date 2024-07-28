"use server";
import prisma from "@/lib/db";

export default async function updateRole(formData: FormData) {
  const roleId = formData.get("roleId");
  const roleName = formData.get("roleName");
  const descript = formData.get("descript");

  if (!roleId) {
    throw new Error("El ID del rol es requerido");
    return;
  }

  try {
    const role = await prisma.role.update({
      where: { id: parseInt(roleId as string) },
      data: {
        roleName: roleName as string,
        descript: descript as string,
      },
    });

    return role;
  } catch (error) {
    throw new Error(`Error al actualizar el rol: ${error}`);
  }
}
