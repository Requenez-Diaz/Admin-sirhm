"use server";

import prisma from "@/lib/db";

// Tipo de estado de booking para el cliente (evita conflictos con enums de Prisma)
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

// DTO que el cliente espera en la tabla
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
          {
            status: { in: ["PENDING", "CONFIRMED"] },
            // ReservationDetails: {
            //   some: { dateStart: { gte: today } }, // o dateEnd según lo que signifique "futuro" en tu negocio
            // },
          },
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
          select: {
            username: true,
            image: true,
            email: true,
          },
        },
        ReservationDetails: {
          select: {
            dateStart: true,
            dateEnd: true,
            guestQuantity: true,
            Bedrooms: { select: { id: true, typeBedroom: true } },
            Promotions: { select: { codePromotions: true } },
          },
        },
      },
    });

    console.log({ reservations });

    const formatted: ReservationRow[] = reservations.map((reservation) => {
      const details = reservation.ReservationDetails ?? [];

      const starts = details.map((d) => d.dateStart).filter(Boolean) as Date[];
      const ends = details.map((d) => d.dateEnd).filter(Boolean) as Date[];

      const minStart = starts.length
        ? new Date(Math.min(...starts.map((d) => new Date(d).getTime())))
        : null;

      const maxEnd = ends.length
        ? new Date(Math.max(...ends.map((d) => new Date(d).getTime())))
        : null;

      const guests = details.reduce(
        (acc, d) => acc + (d.guestQuantity ?? 0),
        0
      );

      const uniqueBedroomIds = new Set<number>();
      const bedroomNamesSet = new Set<string>();

      details.forEach((d) => {
        if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);
        if (d.Bedrooms?.typeBedroom)
          bedroomNamesSet.add(d.Bedrooms.typeBedroom);
      });

      const rooms = uniqueBedroomIds.size;
      const bedroomsType = Array.from(bedroomNamesSet).join(", ");

      const promoSet = new Set<string>();
      details.forEach((d) => {
        const code = d.Promotions?.codePromotions;
        if (code) promoSet.add(code);
      });
      const offerts = promoSet.size ? Array.from(promoSet).join(", ") : null;

      const userName = reservation.User?.username ?? "Usuario desconocido";
      const email = reservation.User?.email ?? null;

      return {
        id: reservation.id,
        status: reservation.status as BookingStatus,
        userName,
        email,
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
