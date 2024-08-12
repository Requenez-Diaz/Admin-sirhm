"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBedrooms(formData: FormData) {
    const bedroomsId = formData.get("bedroomsId")?.toString();
    if (!bedroomsId) {
        console.error("No se proporcionó bedroomsId");
        return;
    }
    try {
        await prisma.bedrooms.delete({
            where: {
                id: parseInt(bedroomsId),
            },
        });

        const bedrooms = await prisma.bedrooms.findMany({
            orderBy: {
                numberBedroom: "asc",
            },
        });

        for (let i = 0; i < bedrooms.length; i++) {
            const currentNumber = i + 1;
            await prisma.bedrooms.update({
                where: {
                    id: bedrooms[i].id,
                },
                data: {
                    numberBedroom: currentNumber,
                },
            });
        }

        revalidatePath("/bedrooms");
    } catch (error) {
        console.error("Error al eliminar la habitación: ", error);
    }
}