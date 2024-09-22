"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateService(formData: FormData) {
    const servicesId = formData.get("serviceId")?.toString();
    const nameService = formData.get("nameService")?.toString();
    const description = formData.get("description")?.toString();
    const price = formData.get("price")?.toString();

    if (!servicesId) {
        console.error("No se proporcionó el ID del servicio");
        return;
    }

    try {
        await prisma.services.update({
            where: {
                id: servicesId,
            },
            data: {
                nameService,
                description,
                price: parseFloat(price || "0"),
            },
        });
        revalidatePath("/services");
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
    }
}