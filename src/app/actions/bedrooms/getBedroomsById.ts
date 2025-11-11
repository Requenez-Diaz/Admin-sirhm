"use server";

import { BedroomsWithImages } from "@/app/(routes)/dashboard/offerts/type";
import prisma from "@/lib/db";
// import { BedroomsWithImages } from "@/types";

export const getBedroomsById = async (id: number): Promise<BedroomsWithImages | null> => {
    try {
        const bedroom = await prisma.bedrooms.findUnique({
            where: { id: Number(id) },
            include: {
                galleryImages: true,
            },
        });
        return bedroom;
    } catch (error) {
        console.error("Error al obtener la habitación", error);
        return null;
    }
};
