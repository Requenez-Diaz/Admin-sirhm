"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSeason(id: number) {
    try {
        await prisma.seasons.delete({
            where: { id },
        });

        revalidatePath("/dashboard/seasons");
        revalidatePath("/dashboard/bedrooms");

        return {
            success: true,
            message: "Temporada eliminada correctamente.",
        };
    } catch (error) {
        console.error("Error al eliminar la temporada:", error);
        return {
            success: false,
            message: "Error al eliminar la temporada. Puede que esté asociada a otros registros.",
        };
    }
}
