"use server";

import prisma from "@/lib/db";

export async function getSeasons() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: [{ dateStart: "asc" }, { dateEnd: "asc" }],
    });
    return seasons;
  } catch (error) {
    console.error("Error al obtener las temporadas:", error);
    return [];
  }
}
