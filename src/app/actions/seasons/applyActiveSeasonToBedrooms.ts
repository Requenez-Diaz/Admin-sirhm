"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionState = { success: boolean; message: string; data?: any };

export async function applyActiveSeasonToBedrooms(): Promise<ActionState> {
  try {
    const now = new Date();

    const activeSeason = await prisma.season.findFirst({
      where: {
        AND: [{ dateStart: { lte: now } }, { dateEnd: { gte: now } }],
      },
    });

    if (activeSeason) {
      await prisma.bedroom.updateMany({
        data: { seasonsId: activeSeason.id },
      });

      revalidatePath("/dashboard/bedrooms");

      return {
        success: true,
        message: "Temporada activa aplicada a todas las habitaciones.",
        data: activeSeason,
      };
    }

    // If no active season, clear seasonsId to null for all bedrooms
    await prisma.bedroom.updateMany({
      data: { seasonsId: null },
    });

    revalidatePath("/dashboard/bedrooms");

    return {
      success: true,
      message:
        "No hay temporada activa. Se removió la temporada de las habitaciones.",
    };
  } catch (error) {
    console.error("Error al aplicar temporada activa a habitaciones:", error);
    return {
      success: false,
      message: "Error al aplicar temporada. Revisa los logs.",
    };
  }
}
