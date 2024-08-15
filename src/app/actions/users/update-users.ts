"use server";

import prisma from "@/lib/db";

export default async function updateUsersById(formData: FormData) {
  const data = {
    userId: formData.get("userId"),
    userName: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    roleId: formData.get("roleId"),
  };

  console.log("Form data of the users: ", data);

  const { userId, userName, email, password, roleId } = data;

  if (!userId) {
    console.error("No user ID provided");
    return;
  }

  try {
    const user = await prisma.user.update({
      where: { id: parseInt(userId as string) },
      data: {
        username: userName as string,
        email: email as string,
        password: password as string,
        roleId: parseInt(roleId as string),
      },
    });

    console.log("User updated: ", user);

    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
}
