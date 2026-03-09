"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SeasonType } from "@prisma/client";

export type ActionState = { success: boolean; message: string; data?: any };

export async function updateSeason(
  _prevState: ActionState,
  formData: FormData,
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

    const dateStart = parseDateLocal(
      formData.get("dateStart") as string | null,
    );
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

    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);

    if (dateEnd < todayLocal) {
      return {
        success: false,
        message:
          "No puedes aplicar una temporada que ya pasó. Solo se permiten fechas actuales o futuras.",
      };
    }

    // if dates changed, validate overlapping seasons excluding current record
    const existing = await prisma.season.findUnique({ where: { id } });
    if (!existing) {
      return {
        success: false,
        message: "Temporada no encontrada.",
      };
    }

    const toDateOnly = (d: Date) => {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };

    const existingStart = new Date(existing.dateStart);
    const existingEnd = new Date(existing.dateEnd);

    const datesUnchanged =
      toDateOnly(existingStart) === toDateOnly(dateStart) &&
      toDateOnly(existingEnd) === toDateOnly(dateEnd);

    if (!datesUnchanged) {
      const overlapping = await prisma.season.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            { dateStart: { lte: dateEnd } },
            { dateEnd: { gte: dateStart } },
          ],
        },
      });

      if (overlapping) {
        return {
          success: false,
          message: "Ya existe una temporada que se solapa con estas fechas.",
        };
      }
    }

    const updated = await prisma.season.update({
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
