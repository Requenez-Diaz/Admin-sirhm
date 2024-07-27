"use server";
import prisma from "@/lib/db";

export default async function findManyUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return users; // Asegúrate de retornar los usuarios
  } catch (error) {
    console.error("Error getting users:", error);
    return []; // Retorna un array vacío en caso de error
  }
}
