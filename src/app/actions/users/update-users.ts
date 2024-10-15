"use server";

import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export default async function updateUsersById(formData: FormData) {
  const data = {
    userId: formData.get("userId"),
    userName: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleName: formData.get("roleName"),
  };

  const { userId, userName, email, password, roleName } = data;

  if (!userId) {
    throw new Error("User ID is required");
  }
  if (!roleName) {
    throw new Error("Role ID is required");
  }

  try {
    const [existingUser, role] = await Promise.all([
      prisma.user.findUnique({ where: { id: parseInt(userId as string) } }),
      prisma.role.findUnique({ where: { roleName: roleName as string } }),
    ]);

    if (!existingUser) {
      throw new Error("User not found");
    }
    if (!role) {
      throw new Error("Role does not exist");
    }

    const hashedPassword = password
      ? await bcrypt.hash(password as string, 10)
      : existingUser.password;

    const user = await prisma.user.update({
      where: { id: parseInt(userId as string) },
      data: {
        username: userName as string,
        email: email as string,
        password: hashedPassword as string,
        role: {
          connect: {
            roleName: roleName as string,
          },
        },
      },
    });

    return { success: true, user };
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
}
