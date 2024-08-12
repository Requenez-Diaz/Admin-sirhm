"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBedroom(formData: FormData) {
    const bedroomsId = formData.get("bedroomsId")?.toString();
    const typeBedroom = formData.get("typeBedroom")?.toString();
    const description = formData.get("description")?.toString();
    const lowSeasonPrice = formData.get("lowSeasonPrice")?.toString();
    const highSeasonPrice = formData.get("highSeasonPrice")?.toString();
    const status = formData.get("status")?.toString();
    const numberBedroom = formData.get("numberBedroom")?.toString();

    if (!bedroomsId) {
        console.error("No se proporcionó bedroomsId");
        return;
    }

    try {
        await prisma.bedrooms.update({
            where: {
                id: parseInt(bedroomsId),
            },
            data: {
                typeBedroom,
                description,
                lowSeasonPrice: parseFloat(lowSeasonPrice || "0"),
                highSeasonPrice: parseFloat(highSeasonPrice || "0"),
                status: status === "1",
                numberBedroom: parseInt(numberBedroom || "0"),
            },
        });
        revalidatePath("/bedrooms");
    } catch (error) {
        console.error("Error al actualizar la habitación: ", error);
    }
}