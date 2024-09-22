"use server";

import prisma from "@/lib/db";

export const getServices = async () => {
    try {
        const services = await prisma.services.findMany();
        return services;
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        throw new Error("No se pudieron obtener los servicios.");
    }
};