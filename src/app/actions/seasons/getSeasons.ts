"use server";

import prisma from "@/lib/db";

export async function getSeasons() {
    try {
        const seasons = await prisma.seasons.findMany({
            orderBy: {
                dateStart: "asc",
            },
        });
        return seasons;
    } catch (error) {
        console.error("Error al obtener las temporadas:", error);
        return [];
    }
}
