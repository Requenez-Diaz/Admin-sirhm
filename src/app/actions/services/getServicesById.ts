"use server";

import prisma from "@/lib/db";

export const getServiceById = async (id: string) => {
    try {
        const service = await prisma.services.findUnique({
            where: { id: id.toString() },
        });

        if (!service) {
            throw new Error(`Servicio con ID ${id} no encontrado.`);
        }

        return service;
    } catch (error) {
        throw new Error("No se pudo obtener el servicio.");
    }
};