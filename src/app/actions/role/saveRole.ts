"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function saveRole(formData: FormData) {
  try {
    const rawFormRole = Object.fromEntries(formData);

    console.log("Raw form role:", rawFormRole);

    if (!prisma || !prisma.role) {
      throw new Error("Prisma client or role model is not defined");
    }

    const role = await prisma.role.create({
      data: {
        roleName: String(rawFormRole.roleName),
        descript: String(rawFormRole.descript),
      },
    });

    console.log("Role saved:", role);
    revalidatePath("/roles");
    return role;
  } catch (error) {
    console.error("Error saving role:", error);
  }
}
