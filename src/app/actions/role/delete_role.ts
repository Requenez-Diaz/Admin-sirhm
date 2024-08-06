"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteRole(formData: FormData) {
  console.log("Form data: ", formData);
  const roleId = formData.get("roleId");

  if (!roleId) {
    console.error("No role ID provided");
    return;
  }
  try {
    await prisma.role.delete({
      where: {
        id: parseInt(roleId.toString()),
      },
    });

    console.log("Role deleted");
    const roles = await prisma.role.findMany({
      orderBy: {
        roleName: "asc",
      },
    });

    for (let role = 0; role < roles.length; role++) {
      const currentNumber = role + 1;
      await prisma.role.update({
        where: {
          id: roles[role].id,
        },
        data: {
          roleName: currentNumber.toString(),
        },
      });
    }
    revalidatePath("/roles");
  } catch (error) {
    console.error("Error deleting role: ", error);
  }
}
