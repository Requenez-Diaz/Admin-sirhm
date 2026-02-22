"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SeasonType } from "@prisma/client";

export type ActionState = { success: boolean; message: string; data?: any };

export async function updateSeason(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        const id = Number(formData.get("id"));
        const nameSeason = formData.get("nameSeason") as SeasonType;

        const parseDateLocal = (s: string | null) => {
            if (!s) return null;
            const parts = s.split("-").map(Number);
            const [y, m, d] = parts;
            return new Date(y, m - 1, d);
        };

        const dateStart = parseDateLocal(formData.get("dateStart") as string | null);
        const dateEnd = parseDateLocal(formData.get("dateEnd") as string | null);

        if (!id || !nameSeason || !dateStart || !dateEnd) {
            return {
                success: false,
                message: "Todos los campos son obligatorios.",
            };
        }

        if (dateStart > dateEnd) {
            return {
                success: false,
                message: "La fecha de inicio no puede ser posterior a la fecha de fin.",
            };
        }

        const updated = await prisma.seasons.update({
            where: { id },
            data: {
                nameSeason,
                dateStart,
                dateEnd,
            },
        });

        revalidatePath("/dashboard/seasons");
        revalidatePath("/dashboard/bedrooms");

        return {
            success: true,
            message: "Temporada actualizada correctamente.",
            data: updated,
        };
    } catch (error) {
        console.error("Error al actualizar la temporada:", error);
        return {
            success: false,
            message: "Error al actualizar la temporada. Intenta nuevamente.",
        };
    }
}
