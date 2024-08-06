"use server";
import prisma from "@/lib/db";

export default async function getRole() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return roles;
  } catch (error) {
    console.error("Error getting roles:", error);
    return [];
  }
}
