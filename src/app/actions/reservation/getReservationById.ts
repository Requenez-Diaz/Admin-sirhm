"use server";

import prisma from "@/lib/db";

export const getReservationById = async (id: number) => {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: Number(id) },
            include: {
                User: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        image: true,
                    },
                },
                ReservationDetails: {
                    include: {
                        Bedrooms: {
                            select: {
                                id: true,
                                typeBedroom: true,
                                capacity: true,
                                lowSeasonPrice: true,
                                highSeasonPrice: true,
                            },
                        },
                        Promotions: {
                            select: {
                                id: true,
                                codePromotions: true,
                                porcentageDescuent: true,
                            },
                        },
                    },
                },
            },
        });
        return reservation;
    } catch (error) {
        console.error("Error al obtener la reservación", error);
        return null;
    }
};