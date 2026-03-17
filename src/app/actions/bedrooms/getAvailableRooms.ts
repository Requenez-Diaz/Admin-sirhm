"use server";

import prisma from "@/lib/db";

export type AvailableRoom = {
    id: number;
    numberBedroom: number;
    description: string;
    capacity: number;
    lowSeasonPrice: number;
    highSeasonPrice: number;
    price: number;
    activeSeason: string;
    amenities: string[];
    image: string;
    slug: string;
    typeName: string | null;
    typeDescription: string | null;
};

export async function getAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    typeBedroomId?: number,
): Promise<AvailableRoom[]> {
    try {
        const parseSafeDate = (d: string | Date) => {
            const iso = typeof d === "string" ? d : new Date(d).toISOString();
            const [y, m, day] = iso.split("T")[0].split("-").map(Number);
            return new Date(y, m - 1, day, 0, 0, 0, 0);
        };

        const normCheckIn = parseSafeDate(checkIn);
        const normCheckOut = parseSafeDate(checkOut);

        // Identificamos la temporada activa a partir de la fecha de entrada
        const activeSeasonModel = await prisma.season.findFirst({
            where: {
                dateStart: { lte: normCheckIn },
                dateEnd: { gte: normCheckIn },
            },
        });
        const activeSeasonName = activeSeasonModel ? activeSeasonModel.nameSeason : "BAJA";

        // IDs de habitaciones que tienen al menos un ReservationDetail activo
        // (Cualquier estado que NO sea CANCELLED, incluyendo PENDING y CONFIRMED)
        // que se solapa con el rango [checkIn, checkOut)
        const busyDetails = await prisma.reservationDetails.findMany({
            where: {
                status: { not: "CANCELLED" },
                dateStart: { lt: normCheckOut },
                dateEnd: { gt: normCheckIn },
            },
            select: { bedrooms_id: true },
        });

        const busyIds = [...new Set(busyDetails.map((d) => d.bedrooms_id))];

        const bedrooms = await prisma.bedroom.findMany({
            where: {
                id: { notIn: busyIds.length > 0 ? busyIds : [-1] },
                status: true, // SOLUCIÓN: Solo mostrar habitaciones activas
                ...(typeBedroomId ? { typeBedroomId } : {}),
            },
            include: {
                TypeBedrooms: true,
            },
            orderBy: { numberBedroom: "asc" },
        });

        return bedrooms.map((b) => {
            const currentPrice = activeSeasonName === "ALTA" ? b.highSeasonPrice : b.lowSeasonPrice;
            return {
                id: b.id,
                numberBedroom: b.numberBedroom,
                description: b.description,
                capacity: b.capacity,
                lowSeasonPrice: b.lowSeasonPrice,
                highSeasonPrice: b.highSeasonPrice,
                price: currentPrice,
                activeSeason: activeSeasonName,
                amenities: b.amenities,
                image: b.image,
                slug: b.slug,
                typeName: b.TypeBedrooms?.nameType ?? null,
                typeDescription: b.TypeBedrooms?.description ?? null,
            };
        });
    } catch (error) {
        console.error("Error al obtener habitaciones disponibles:", error);
        return [];
    }
}
