"use server";

import prisma from "@/lib/db";

export interface HistoricReservation {
    id: number;
    userName: string;
    userEmail: string;
    userImage: string | null;
    bedroomsType: string;
    rooms: number;
    guests: number;
    arrivalDate: Date | null;
    departureDate: Date | null;
    finalStatus: "COMPLETED" | "EXPIRED" | "CANCELLED";
    offerts: string | null;
    createdAt: Date;
}

export const getHistoricReservations = async (): Promise<HistoricReservation[]> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Aseguramos que la comparación sea solo por fecha

        const reservations = await prisma.reservation.findMany({
            where: {
                ReservationDetails: {
                    some: { dateEnd: { lt: today } }, // Solo detalles que ya terminaron
                },
                OR: [
                    { status: "CONFIRMED" },
                    { status: "PENDING" },
                    { status: "CANCELLED" },
                ],
            },
            orderBy: { createdAt: "desc" },
            include: {
                User: {
                    select: { username: true, email: true, image: true },
                },
                ReservationDetails: {
                    include: {
                        Bedrooms: { select: { typeBedroom: true } },
                        Promotions: { select: { codePromotions: true } },
                    },
                },
            },
        });

        const historic: HistoricReservation[] = [];

        reservations.forEach((r) => {
            // Filtramos solo los detalles que ya caducaron
            const expiredDetails = r.ReservationDetails.filter(d => d.dateEnd < today);

            expiredDetails.forEach((details) => {
                let finalStatus: HistoricReservation["finalStatus"];

                if (r.status === "CONFIRMED") finalStatus = "COMPLETED";
                else if (r.status === "PENDING") finalStatus = "EXPIRED";
                else finalStatus = "CANCELLED";

                historic.push({
                    id: r.id,
                    userName: r.User?.username || "Sin nombre",
                    userEmail: r.User?.email || "Sin email",
                    userImage: r.User?.image || null,
                    bedroomsType: details.Bedrooms?.typeBedroom || "-",
                    rooms: 1, // una por detalle
                    guests: details.guestQuantity || 0,
                    arrivalDate: details.dateStart,
                    departureDate: details.dateEnd,
                    finalStatus,
                    offerts: details.Promotions?.codePromotions || null,
                    createdAt: r.createdAt,
                });
            });
        });

        return historic;
    } catch (error) {
        console.error("Error cargando historial:", error);
        return [];
    }
};
