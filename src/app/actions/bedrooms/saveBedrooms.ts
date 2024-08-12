"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const saveBedrooms = async (formData: FormData) => {
    const typeBedroom = formData.get("typeBedroom") as string;
    const description = formData.get("description") as string;
    const lowSeasonPrice = Number(formData.get("lowSeasonPrice"));
    const highSeasonPrice = Number(formData.get("highSeasonPrice"));
    const numberBedroom = Number(formData.get("numberBedroom"));
    const seasons = formData.get("seasons") as string;
    const active = formData.get("status") === "1";

    try {
        const existingBedroom = await prisma.bedrooms.findFirst({
            where: {
                numberBedroom: numberBedroom,
            },
        });

        if (existingBedroom) {
            console.log(
                `El número de habitación ${numberBedroom} ya está registrado.`
            );
            return {
                success: false,
                message: `El número de habitación ${numberBedroom} ya está registrado.`,
            };
        }

        const newBedroom = await prisma.bedrooms.create({
            data: {
                typeBedroom: typeBedroom ?? "",
                description: description ?? "",
                lowSeasonPrice: lowSeasonPrice,
                highSeasonPrice: highSeasonPrice,
                numberBedroom: numberBedroom,
                status: active,
                Seasons: {
                    create: {
                        nameSeason: seasons ?? "",
                        dateStart: new Date(),
                        dateEnd: new Date(),
                    },
                },
            },
        });
        revalidatePath("/bedrooms");

        console.log("Habitación guardada con éxito", newBedroom);
        return {
            success: true,
            message: "La habitación se registró correctamente.",
        };
    } catch (error) {
        console.error("Error al guardar la habitación", error);
        return { success: false, message: "Error al guardar la habitación" };
    }
};