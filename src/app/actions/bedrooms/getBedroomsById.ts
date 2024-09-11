"use server";

import prisma from "@/lib/db";
import { Bedrooms } from "@prisma/client";

export const getBedroomsById = async (id: number): Promise<Bedrooms | null> => {
    try {
        const bedroom = await prisma.bedrooms.findUnique({
            where: { id: Number(id) },
        });
        return bedroom;
    } catch (error) {
        console.error("Error al obtener la habitación", error);
        return null;
    }
};