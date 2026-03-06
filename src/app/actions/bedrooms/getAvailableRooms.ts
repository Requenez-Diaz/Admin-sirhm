"use server";

import prisma from "@/lib/db";

export type AvailableRoom = {
    id: number;
    numberBedroom: number;
    description: string;
    capacity: number;
    lowSeasonPrice: number;
    highSeasonPrice: number;
    amenities: string[];
    image: string;
    slug: string;
    typeName: string | null;
    typeDescription: string | null;
};

export async function getAvailableRooms(
    checkIn: Date,
    checkOut: Date,
    typeBedroomId?: number
): Promise<AvailableRoom[]> {
    try {
        // IDs de habitaciones que tienen al menos un ReservationDetail activo
        // (Cualquier estado que NO sea CANCELLED, incluyendo PENDING y CONFIRMED)
        // que se solapa con el rango [checkIn, checkOut)
        const busyDetails = await prisma.reservationDetails.findMany({
            where: {
                status: { not: "CANCELLED" },
                dateStart: { lt: checkOut },
                dateEnd: { gt: checkIn },
            },
            select: { bedrooms_id: true },
        });

        const busyIds = [...new Set(busyDetails.map((d) => d.bedrooms_id))];

        const bedrooms = await prisma.bedrooms.findMany({
            where: {
                id: { notIn: busyIds.length > 0 ? busyIds : [-1] },
                ...(typeBedroomId ? { typeBedroomId } : {}),
            },
            include: {
                TypeBedrooms: true,
            },
            orderBy: { numberBedroom: "asc" },
        });

        return bedrooms.map((b) => ({
            id: b.id,
            numberBedroom: b.numberBedroom,
            description: b.description,
            capacity: b.capacity,
            lowSeasonPrice: b.lowSeasonPrice,
            highSeasonPrice: b.highSeasonPrice,
            amenities: b.amenities,
            image: b.image,
            slug: b.slug,
            typeName: b.TypeBedrooms?.nameType ?? null,
            typeDescription: b.TypeBedrooms?.description ?? null,
        }));
    } catch (error) {
        console.error("Error al obtener habitaciones disponibles:", error);
        return [];
    }
}
