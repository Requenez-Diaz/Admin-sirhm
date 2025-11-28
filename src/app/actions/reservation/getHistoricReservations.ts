"use server";

import prisma from "@/lib/db";

export const getHistoricReservations = async () => {
    try {
        const today = new Date();

        const reservations = await prisma.reservation.findMany({
            where: {
                OR: [
                    { status: "CONFIRMED", departureDate: { lt: today } },
                    { status: "PENDING", departureDate: { lt: today } },
                    { status: "CANCELLED", departureDate: { lt: today } },
                ],
            },
            orderBy: { createdAt: "desc" },
            include: {
                Promotions: { select: { codePromotions: true } },
                user: { select: { username: true, image: true, email: true } },
            },
        });

        const formattedReservations = reservations.map((r) => {
            let finalStatus: string = r.status;

            if (r.status === "CONFIRMED" && r.departureDate < today) finalStatus = "COMPLETED";
            if (r.status === "PENDING" && r.departureDate < today) finalStatus = "EXPIRED";
            if (r.status === "CANCELLED" && r.departureDate < today) finalStatus = "CANCELLED";

            return {
                id: r.id,
                userName: r.user?.username || `${r.name} ${r.lastName}`,
                userEmail: r.user?.email || r.email,
                userImage: r.user?.image || null,
                bedroomsType: r.bedroomsType,
                rooms: r.rooms,
                guests: r.guests,
                arrivalDate: r.arrivalDate,
                departureDate: r.departureDate,
                finalStatus,
                offerts: r.Promotions?.codePromotions || null,
                createdAt: r.createdAt,
            };
        });

        return formattedReservations;
    } catch (error) {
        console.error("Error cargando historial:", error);
        return [];
    }
};
