"use server";

import prisma from "@/lib/db";

export const getHistoricReservations = async () => {
    try {
        const today = new Date();

        const reservations = await prisma.reservation.findMany({
            where: {
                OR: [
                    { status: "CONFIRMED" },
                    { status: "PENDING" },
                    { status: "CANCELLED" },
                ],
            },
            orderBy: { createdAt: "desc" },
            include: {
                User: {
                    select: {
                        username: true,
                        image: true,
                        email: true
                    }
                },
                ReservationDetails: {
                    include: {
                        Bedrooms: {
                            select: {
                                typeBedroom: true,
                            },
                        },
                        Promotions: {
                            select: {
                                codePromotions: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedReservations = reservations.map((r) => {
            const details = r.ReservationDetails[0];

            let finalStatus: string = r.status;

            // Determinar estado final basado en fecha de salida
            if (details && details.dateEnd < today) {
                if (r.status === "CONFIRMED") finalStatus = "COMPLETED";
                if (r.status === "PENDING") finalStatus = "EXPIRED";
                if (r.status === "CANCELLED") finalStatus = "CANCELLED";
            }

            return {
                id: r.id,
                userName: r.User?.username || "Sin nombre",
                userEmail: r.User?.email || "Sin email",
                userImage: r.User?.image || null,
                bedroomsType: details?.Bedrooms?.typeBedroom || "-",
                rooms: 1, // Una habitación por detalle de reservación
                guests: details?.guestQuantity || 0,
                arrivalDate: details?.dateStart || new Date(),
                departureDate: details?.dateEnd || new Date(),
                finalStatus,
                offerts: details?.Promotions?.codePromotions || null,
                createdAt: r.createdAt,
            };
        });

        return formattedReservations;
    } catch (error) {
        console.error("Error cargando historial:", error);
        return [];
    }
};
