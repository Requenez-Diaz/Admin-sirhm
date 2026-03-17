"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSeason(id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Unlink from bedrooms (set seasonsId to null)
      await tx.bedroom.updateMany({
        where: { seasonsId: id },
        data: { seasonsId: null },
      });

      // 2. Check for promotions (prevent unintended data loss)
      const promoCount = await tx.promotions.count({
        where: { seasonId: id },
      });

      if (promoCount > 0) {
        throw new Error("PROMOTIONS_EXIST");
      }

      // 3. Delete the season
      await tx.season.delete({
        where: { id },
      });
    });

    revalidatePath("/dashboard/seasons");
    revalidatePath("/dashboard/bedrooms");

    return {
      success: true,
      message: "Temporada eliminada correctamente.",
    };
  } catch (error: any) {
    if (error.message === "PROMOTIONS_EXIST") {
      return {
        success: false,
        message:
          "No se puede eliminar la temporada porque tiene promociones asociadas. Elimina primero las promociones.",
      };
    }
    console.error("Error al eliminar la temporada:", error);
    return {
      success: false,
      message: "Error al eliminar la temporada. Revisa los logs del servidor.",
    };
  }
}
