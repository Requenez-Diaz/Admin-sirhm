"use server";

import prisma from "@/lib/db";

export const getAllSeasons = async () => {
  try {
    const seasons = await prisma.seasons.findMany({
      select: {
        id: true,
        nameSeason: true,
        dateStart: true,
        dateEnd: true,
      },
    });
    console.log("Temporadas obtenidas", seasons);
    return seasons;
  } catch (error) {
    console.error("Error al obtener las temporadas", error);
    return [];
  }
};
