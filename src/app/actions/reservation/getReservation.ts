"use server";

import prisma from "@/lib/db";

export interface ReservationFormatted {
  id: number;
  status: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  totalGuests: number;
  totalRooms: number;
  guests: number;
  rooms: number;
  arrivalDate: Date | null;
  departureDate: Date | null;
  bedroomsType: string;
  offerts: string | null;
}

export const getReservations = async (): Promise<ReservationFormatted[]> => {
  try {
    const today = new Date();

    const reservations = await prisma.reservation.findMany({
      where: {
        ReservationDetails: {
          some: {
            dateEnd: { gte: today }, // solo detalles que aún no caducaron
          },
        },
        status: {
          in: ["PENDING", "CONFIRMED", "CANCELLED"], // mostrar solo estos estados
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        User: { select: { username: true, email: true, image: true } },
        ReservationDetails: {
          select: {
            guestQuantity: true,
            Bedrooms: { select: { typeBedroom: true } },
            Promotions: { select: { codePromotions: true } },
            dateStart: true,
            dateEnd: true,
          },
        },
      },
    });

    const formattedReservations: ReservationFormatted[] = reservations.map((res) => {
      const details = res.ReservationDetails[0]; // asumimos 1 detalle por reserva
      const totalGuests = details?.guestQuantity || 0;
      const totalRooms = res.ReservationDetails.length || 1;

      return {
        id: res.id,
        status: res.status,
        userName: res.User?.username || "Sin nombre",
        userEmail: res.User?.email || "Sin email",
        userImage: res.User?.image || null,
        totalGuests,
        totalRooms,
        guests: totalGuests,
        rooms: totalRooms,
        arrivalDate: details?.dateStart || null,
        departureDate: details?.dateEnd || null,
        bedroomsType: details?.Bedrooms?.typeBedroom || "-",
        offerts: details?.Promotions?.codePromotions || null,
      };
    });

    return formattedReservations;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return [];
  }
};
