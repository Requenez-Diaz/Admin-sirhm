"use server";

import prisma from "@/lib/db";

export const getReservationById = async (id: number) => {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: Number(id) },
        });
        return reservation;
    } catch (error) {
        console.error("Error al obtener la reservación", error);
        return null;
    }
};