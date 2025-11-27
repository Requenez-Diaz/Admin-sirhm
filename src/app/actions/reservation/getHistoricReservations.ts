"use server";

import prisma from "@/lib/db";

export const getHistoricReservations = async () => {
    try {
        const today = new Date();

        const reservations = await prisma.reservation.findMany({
            where: {
                OR: [
                    {
                        status: "CONFIRMED",
                        departureDate: { lt: today },
                    },
                    {
                        status: "PENDING",
                        departureDate: { lt: today },
                    },
                    {
                        status: "CANCELLED",
                    },
                ],
            },
            orderBy: { createdAt: "desc" },
            include: {
                Promotions: { select: { codePromotions: true } },
                user: {
                    select: {
                        username: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });

        const formattedReservations = reservations.map((r) => {
            let finalStatus: string = r.status;

            if (r.status === "CONFIRMED" && r.departureDate < today) {
                finalStatus = "COMPLETED";
            }

            if (r.status === "PENDING" && r.departureDate < today) {
                finalStatus = "EXPIRED";
            }

            return {
                ...r,
                finalStatus,
                offerts: r.Promotions?.codePromotions || null,
                userName: r.user?.username || `${r.name} ${r.lastName}`,
                userEmail: r.user?.email || r.email,
                userImage: r.user?.image || null,
            };
        });

        return formattedReservations;
    } catch (error) {
        console.error("Error cargando historial:", error);
        return [];
    }
};
