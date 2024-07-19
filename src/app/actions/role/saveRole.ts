"use server";

import prisma from "@/lib/db";

export default async function saveRole(formData: FormData) {
  try {
    const rawFormRole = Object.fromEntries(formData);
    console.log("Raw form role:", rawFormRole);

    if (!prisma || !prisma.role) {
      throw new Error("Prisma client or role model is not defined");
    }

    const role = await prisma.role.create({
      data: {
        name: rawFormRole.name as string,
      },
    });

    console.log("Role saved:", role);

    return role;
  } catch (error) {
    console.error("Error saving role:", error);
  }
}
