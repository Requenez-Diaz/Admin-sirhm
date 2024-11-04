"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const saveBedrooms = async (data: {
    typeBedroom: string;
    description: string;
    lowSeasonPrice: number;
    highSeasonPrice: number;
    numberBedroom: number;
    capacity: number;
    status: string;
}) => {
    const { typeBedroom, description, lowSeasonPrice, highSeasonPrice, numberBedroom, capacity, status } = data;
    const active = status === "1";

    try {
        const existingBedroom = await prisma.bedrooms.findFirst({
            where: {
                numberBedroom: numberBedroom,
            },
        });

        if (existingBedroom) {
            console.log(`El número de habitación ${numberBedroom} ya está registrado.`);
            return {
                success: false,
                message: `El número de habitación ${numberBedroom} ya está registrado.`,
            };
        }

        await prisma.bedrooms.create({
            data: {
                typeBedroom: typeBedroom,
                description: description,
                lowSeasonPrice: lowSeasonPrice,
                highSeasonPrice: highSeasonPrice,
                numberBedroom: numberBedroom,
                capacity: capacity,
                status: active,
                Seasons: {
                    create: {
                        nameSeason: "defaultSeason",
                        dateStart: new Date(),
                        dateEnd: new Date(),
                    },
                },
            },
        });

        revalidatePath("/bedrooms");

        return {
            success: true,
            message: "La habitación se registró correctamente.",
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error al guardar la habitación" };
    }
};
