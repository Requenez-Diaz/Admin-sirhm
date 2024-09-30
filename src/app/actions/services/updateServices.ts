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
        return {
            success: false,
            message: "No se proporcionó el ID del servicio.",
        };
    }

    if (!nameService || !description || !price) {
        console.error("Los campos son obligatorios");
        return {
            success: false,
            message: "Todos los campos son obligatorios.",
        };
    }

    const parsedPrice = parseFloat(price);
    
    if (isNaN(parsedPrice) || parsedPrice < 0) {
        console.error("El precio debe ser un número mayor o igual a cero");
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

        console.log("Servicio actualizado con éxito");
        
        return {
            success: true,
            message: "El servicio se actualizó correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        
        return {
            success: false,
            message: "Error al actualizar el servicio.",
        };
    }
}