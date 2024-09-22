"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteService(formData: FormData) {
    const serviceId = formData.get("serviceId")?.toString();

    if (!serviceId) {
        console.error("No se proporcionó serviceId");
        return { success: false, message: "ID del servicio no proporcionado." };
    }

    try {
        await prisma.services.delete({
            where: {
                id: serviceId,
            },
        });
        revalidatePath("/services");

        return { success: true, message: "Servicio eliminado correctamente." };
    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        return { success: false, message: "Error al eliminar el servicio." };
    }
}