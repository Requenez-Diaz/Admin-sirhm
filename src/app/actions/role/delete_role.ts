"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteRole(formData: FormData) {
  const roleId = formData.get("roleId");

  if (!roleId) {
    console.error("No role ID provided");
    return;
  }
  try {
    const parsedRoleId = parseInt(roleId.toString());
    await prisma.role.delete({
      where: {
        id: parsedRoleId,
      },
    });
    revalidatePath("/roles");
  } catch (error) {
    console.error("Error deleting role: ", error);
  }
}
