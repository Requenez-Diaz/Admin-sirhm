"use server";

import prisma from "@/lib/db";

export async function getTypeBedrooms() {
    try {
        const types = await prisma.typeBedrooms.findMany();
        return types;
    } catch (error) {
        console.error("Error al obtener tipos de habitaciones:", error);
        return [];
    }
}
