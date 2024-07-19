"use server";
import prisma from "@/lib/db";

export default async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error getting users:", error);
  }
}
