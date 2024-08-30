"use server";
import prisma from "@/lib/db";

export default async function findManyUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
    console.log("Users fetched:", users); // Para depuración
    return users;
  } catch (error) {
    console.error("Error getting users:", error);

    return [];
  }
}
