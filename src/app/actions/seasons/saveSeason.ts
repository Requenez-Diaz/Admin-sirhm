"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SeasonType } from "@prisma/client";

export type ActionState = { success: boolean; message: string; data?: any };

export async function saveSeason(
    _prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    try {
        const nameSeason = formData.get("nameSeason") as SeasonType;
        const dateStart = new Date(formData.get("dateStart") as string);
        const dateEnd = new Date(formData.get("dateEnd") as string);

        if (!nameSeason || !dateStart || !dateEnd) {
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

        const created = await prisma.seasons.create({
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
            message: "Temporada creada correctamente.",
            data: created,
        };
    } catch (error) {
        console.error("Error al guardar la temporada:", error);
        return {
            success: false,
            message: "Error al guardar la temporada. Intenta nuevamente.",
        };
    }
}
