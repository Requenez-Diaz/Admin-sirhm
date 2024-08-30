"use server";

import prisma from "@/lib/db";

export default async function getRoleById(
  roleId: number
): Promise<typeof role | null> {
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  return role;
}
