"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionState = { success: boolean; message: string };

export async function applySeasonToAllBedrooms(
    seasonId: number
): Promise<ActionState> {
    try {
        if (!seasonId) {
            return { success: false, message: "ID de temporada inválido." };
        }

        const season = await prisma.seasons.findUnique({ where: { id: seasonId } });
        if (!season) {
            return { success: false, message: "Temporada no encontrada." };
        }

        const result = await prisma.bedrooms.updateMany({
            data: { seasonsId: seasonId },
        });

        revalidatePath("/dashboard/seasons");
        revalidatePath("/dashboard/bedrooms");

        return {
            success: true,
            message: `Temporada ${season.nameSeason} aplicada a ${result.count} habitación(es) correctamente.`,
        };
    } catch (error) {
        console.error("Error al aplicar temporada a todas las habitaciones:", error);
        return {
            success: false,
            message: "Error al aplicar la temporada. Intenta nuevamente.",
        };
    }
}
