"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteUsers(formData: FormData) {
  const userId = formData.get("userId")?.toString();
  console.log("Form data of the users: ", formData);

  const formDataArray = Array.from(formData.entries());
  for (const [key, value] of formDataArray) {
    console.log(key, value);
  }

  console.log("User ID: ", userId);

  if (!userId) {
    console.error("No user ID provided");
    return;
  }

  try {
    const parsedUserId = parseInt(userId);

    console.log("Parsed User ID: ", parsedUserId);

    await prisma.user.delete({
      where: {
        id: parsedUserId,
      },
    });

    console.log("User deleted");
    const users = await prisma.user.findMany({
      orderBy: {
        username: "asc",
      },
    });

    for (let user = 0; user < users.length; user++) {
      const currentNumber = user + 1;
      await prisma.user.update({
        where: {
          id: users[user].id,
        },
        data: {
          username: currentNumber.toString(),
        },
      });
    }
    revalidatePath("/users");
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
}
