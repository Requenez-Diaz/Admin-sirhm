"use server";

import prisma from "@/lib/db";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type ReservationRow = {
  id: number;
  status: BookingStatus;
  userName: string;
  email: string | null;
  guests: number;
  rooms: number;
  bedroomsType: string;
  arrivalDate: string | null;
  departureDate: string | null;
  offerts: string | null;
};

export const getReservations = async (): Promise<ReservationRow[]> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const reservations = await prisma.reservation.findMany({
      where: {
        OR: [
          { status: { in: ["PENDING", "CONFIRMED"] } },
          {
            status: "CANCELLED",
            ReservationDetails: {
              some: { dateStart: { gte: today } },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        User: {
          select: { username: true, email: true },
        },
        ReservationDetails: {
          include: {
            // CAMBIO CLAVE: Usamos include para Bedrooms para poder entrar a TypeBedrooms
            Bedrooms: {
              include: {
                TypeBedrooms: true,
              },
            },
            Promotions: { select: { codePromotions: true } },
          },
        },
      },
    });

    const formatted: ReservationRow[] = reservations.map((reservation) => {
      const details = reservation.ReservationDetails ?? [];

      const starts = details.map((d) => d.dateStart).filter(Boolean);
      const ends = details.map((d) => d.dateEnd).filter(Boolean);

      const minStart = starts.length
        ? new Date(Math.min(...starts.map((d) => d.getTime())))
        : null;

      const maxEnd = ends.length
        ? new Date(Math.max(...ends.map((d) => d.getTime())))
        : null;

      const guests = details.reduce(
        (acc, d) => acc + (d.guestQuantity ?? 0),
        0,
      );

      const uniqueBedroomIds = new Set<number>();
      const bedroomTypesSet = new Set<string>();

      details.forEach((d) => {
        if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);

        // RUTA CORREGIDA: Accedemos al nameType de la relación TypeBedrooms
        const typeName = d.Bedrooms?.TypeBedrooms?.nameType;
        if (typeName) bedroomTypesSet.add(typeName);
      });

      const rooms = uniqueBedroomIds.size;
      const bedroomsType = Array.from(bedroomTypesSet).join(", ") || "Sin tipo";

      const promoSet = new Set<string>();
      details.forEach((d) => {
        const code = d.Promotions?.codePromotions;
        if (code) promoSet.add(code);
      });
      const offerts = promoSet.size ? Array.from(promoSet).join(", ") : null;

      return {
        id: reservation.id,
        status: reservation.status as BookingStatus,
        userName: reservation.User?.username ?? "Usuario desconocido",
        email: reservation.User?.email ?? null,
        guests,
        rooms,
        bedroomsType,
        arrivalDate: minStart ? minStart.toISOString() : null,
        departureDate: maxEnd ? maxEnd.toISOString() : null,
        offerts,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return [];
  }
};
