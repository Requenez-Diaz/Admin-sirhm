"use server";

import prisma from "@/lib/db";
import { BookingsStatus } from "@prisma/client";

export interface ReservationDTO {
  id: number;
  name: string;
  lastName: string;
  email: string;
  bedroomsType: string;
  guests: number;
  rooms: number;
  arrivalDate: string | null; 
  departureDate: string | null; 
  offerts?: string | null;
  status: BookingsStatus;
  promotionId: number | null;
  isRead: boolean;
}

export const getReservationById = async (
  id: number
): Promise<ReservationDTO | null> => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: Number(id) },
      include: {
        User: {
          select: {
            username: true,
            email: true,
          },
        },
        ReservationDetails: {
          select: {
            dateStart: true,
            dateEnd: true,
            guestQuantity: true,
            bedrooms_id: true,
            Bedrooms: { select: { id: true, typeBedroom: true } },
            promotion_id: true,
            Promotions: { select: { codePromotions: true } },
          },
        },
      },
    });

    if (!reservation) return null;

    const details = reservation.ReservationDetails ?? [];

    // Consolida fechas: mínimo inicio (arrival) y máximo fin (departure)
    const starts = details.map((d) => d.dateStart).filter(Boolean) as Date[];
    const ends = details.map((d) => d.dateEnd).filter(Boolean) as Date[];

    const minStart = starts.length
      ? new Date(Math.min(...starts.map((d) => new Date(d).getTime())))
      : null;

    const maxEnd = ends.length
      ? new Date(Math.max(...ends.map((d) => new Date(d).getTime())))
      : null;

    // Suma de huéspedes en todos los detalles
    const guests = details.reduce((acc, d) => acc + (d.guestQuantity ?? 0), 0);

    // Habitaciones únicas y nombres
    const uniqueBedroomIds = new Set<number>();
    const bedroomNamesSet = new Set<string>();
    details.forEach((d) => {
      if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);
      if (d.Bedrooms?.typeBedroom) bedroomNamesSet.add(d.Bedrooms.typeBedroom);
    });

    const rooms = uniqueBedroomIds.size;
    const bedroomsType = Array.from(bedroomNamesSet).join(", ");

    // Promociones: códigos únicos
    const promoSet = new Set<string>();
    details.forEach((d) => {
      const code = d.Promotions?.codePromotions;
      if (code) promoSet.add(code);
    });

    const offerts = promoSet.size ? Array.from(promoSet).join(", ") : null;

    // Toma el primer promotion_id si necesitas uno específico
    const promotionId =
      details.find((d) => d.promotion_id != null)?.promotion_id ?? null;

    // Deriva nombre y apellido desde username (si no hay separación real)
    const username = reservation.User?.username ?? "";
    const [firstName, ...lastParts] = username.split(" ");
    const lastName = lastParts.join(" ");

    const dto: ReservationDTO = {
      id: reservation.id,
      name: firstName || username || "Usuario",
      lastName: lastName || "",
      email: reservation.User?.email ?? "",
      bedroomsType,
      guests,
      rooms,
      arrivalDate: minStart ? minStart.toISOString() : null,
      departureDate: maxEnd ? maxEnd.toISOString() : null,
      offerts,
      status: reservation.status,
      promotionId,
      isRead: reservation.isRead,
    };

    return dto;
  } catch (error) {
    console.error("Error al obtener la reservación", error);
    return null;
  }
};
