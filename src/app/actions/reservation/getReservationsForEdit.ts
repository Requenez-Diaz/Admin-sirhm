"use server";

import prisma from "@/lib/db";

export const getReservationById = async (id: number) => {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: {
                id: id,
            },
            include: {
                // Traemos los datos del usuario relacionado
                User: true,
                // Traemos los detalles, y dentro de detalles, la información de la habitación
                ReservationDetails: {
                    include: {
                        Bedrooms: {
                            include: {
                                TypeBedrooms: true,
                            },
                        },
                    },
                },
            },
        });

        if (!reservation) {
            return null;
        }

        return reservation;
    } catch (error) {
        console.error("Error al obtener la reservación:", error);
        return null;
    }
};