"use server";

import prisma from "@/lib/db";

export default async function getUserById(
  userId: number
): Promise<typeof user | null> {
  // Use the `prisma` client to find a user by ID
  // Remember to return the user

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  console.log("User: ", user);
  return user;
}
