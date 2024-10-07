"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const saveService = async (formData: FormData) => {
    const nameService = formData.get("nameService") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    if (!nameService || !description || !price) {
        return {
            success: false,
            message: "Todos los campos son obligatorios.",
        };
    }

    try {
        const existingService = await prisma.services.findFirst({
            where: {
                nameService: nameService,
            },
        });

        if (existingService) {
            return {
                success: false,
                message: `El servicio "${nameService}" ya está registrado.`,
            };
        }

        await prisma.services.create({
            data: {
                nameService: nameService,
                description: description,
                price: price,
            },
        });

        revalidatePath("/services");

        return {
            success: true,
            message: "El servicio se registró correctamente.",
        };
    } catch (error) {
        console.error("Error al guardar el servicio", error);
        return { success: false, message: "Error al guardar el servicio" };
    }
};