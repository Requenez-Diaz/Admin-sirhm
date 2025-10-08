// actions/getUserImage.ts (or wherever you keep your server actions)

"use server";

import prisma from "@/lib/db";
import { auth } from "../../../../auth";

export async function GetUserImageById() {
  try {
    const session = await auth();

    // Check if the user is logged in
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const userId = Number(session.user.id);

    // Fetch the user's image directly from the 'User' model
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    console.log("Fetched user:", {  
      userId,
      image: user?.image,
    });

    if (!user?.image) {
      return { success: false, error: "Image not found" };
    }

    return { success: true, image: user.image };
  } catch (error) {
    console.error("Error fetching user image:", error);
    return { success: false, error: "Failed to fetch user image" };
  }
}
