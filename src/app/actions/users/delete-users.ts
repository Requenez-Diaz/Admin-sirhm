"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteUsers(formData: FormData) {
  const userId = formData.get("userId")?.toString();
  console.log("Form data of the users: ", formData);

  if (!userId) {
    console.error("No user ID provided");
    return;
  }

  try {
    const parsedUserId = parseInt(userId);

    await prisma.user.delete({
      where: {
        id: parsedUserId,
      },
    });

    console.log("User deleted");
    revalidatePath("/users");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}
