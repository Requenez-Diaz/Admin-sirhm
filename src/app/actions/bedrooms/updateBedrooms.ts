"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateBedroom = async (data: {
    bedroomsId: string;
    typeBedroom: string;
    description: string;
    lowSeasonPrice: number;
    highSeasonPrice: number;
    numberBedroom: number;
    capacity: number;
    status: string;
}) => {
    const { bedroomsId, typeBedroom, description, lowSeasonPrice, highSeasonPrice, numberBedroom, capacity, status } = data;
    const active = status === "1";

    try {
        const existingBedroom = await prisma.bedrooms.findUnique({
            where: {
                id: parseInt(bedroomsId),
            },
        });

        if (!existingBedroom) {
            return {
                success: false,
                message: "La habitación no existe.",
            };
        }

        await prisma.bedrooms.update({
            where: {
                id: parseInt(bedroomsId),
            },
            data: {
                typeBedroom,
                description,
                lowSeasonPrice,
                highSeasonPrice,
                numberBedroom,
                capacity,
                status: active,
            },
        });

        revalidatePath("/bedrooms");

        return {
            success: true,
            message: "La habitación se actualizó correctamente.",
        };
    } catch (error) {
        return { success: false, message: "Error al actualizar la habitación." };
    }
};