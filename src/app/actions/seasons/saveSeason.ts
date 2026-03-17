"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { SeasonType } from "@prisma/client";
import { applyActiveSeasonToBedrooms } from "./applyActiveSeasonToBedrooms";

export type ActionState = { success: boolean; message: string; data?: any };

export async function saveSeason(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
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

    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);

    if (dateEnd < todayLocal) {
      return {
        success: false,
        message:
          "No puedes aplicar una temporada que ya pasó. Solo se permiten fechas actuales o futuras.",
      };
    }

    // validate overlapping seasons
    const overlapping = await prisma.season.findFirst({
      where: {
        AND: [{ dateStart: { lte: dateEnd } }, { dateEnd: { gte: dateStart } }],
      },
    });

    if (overlapping) {
      return {
        success: false,
        message: "Ya existe una temporada que se solapa con estas fechas.",
      };
    }

    const created = await prisma.season.create({
      data: {
        nameSeason,
        dateStart,
        dateEnd,
      },
    });

    // If the created season is currently active, or the user requested it, apply it to all bedrooms
    const now = new Date();
    const applyNow = formData.get("applyNow");
    if (applyNow || (dateStart <= now && now <= dateEnd)) {
      await applyActiveSeasonToBedrooms();
    }

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
