"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateService(formData: FormData) {
    const servicesId = formData.get("serviceId")?.toString();
    const nameService = formData.get("nameService")?.toString();
    const description = formData.get("description")?.toString();
    const price = formData.get("price")?.toString();

    if (!servicesId) {
        return {
            success: false,
            message: "No se proporcionó el ID del servicio.",
        };
    }

    if (!nameService || !description || !price) {
        return {
            success: false,
            message: "Todos los campos son obligatorios.",
        };
    }

    const parsedPrice = parseFloat(price);
    
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        return {
            success: false,
            message: "El precio debe ser un número mayor o igual a cero.",
        };
    }

    try {
        await prisma.services.update({
            where: {
                id: servicesId,
            },
            data: {
                nameService,
                description,
                price: parsedPrice,
            },
        });

        revalidatePath("/services");
        
        return {
            success: true,
            message: "El servicio se actualizó correctamente.",
        };
    } catch (error) {
        
        return {
            success: false,
            message: "Error al actualizar el servicio.",
        };
    }
}