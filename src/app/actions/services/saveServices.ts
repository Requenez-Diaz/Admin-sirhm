"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const saveService = async (formData: FormData) => {
    const nameService = formData.get("nameService") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));

    try {
        const existingService = await prisma.services.findFirst({
            where: {
                nameService: nameService,
            },
        });

        if (existingService) {
            console.log(`El servicio "${nameService}" ya está registrado.`);
            return {
                success: false,
                message: `El servicio "${nameService}" ya está registrado.`,
            };
        }

        const newService = await prisma.services.create({
            data: {
                nameService: nameService,
                description: description,
                price: price,
            },
        });

        revalidatePath("/services");

        console.log("Servicio guardado con éxito", newService);
        return {
            success: true,
            message: "El servicio se registró correctamente.",
        };
    } catch (error) {
        console.error("Error al guardar el servicio", error);
        return { success: false, message: "Error al guardar el servicio" };
    }
};