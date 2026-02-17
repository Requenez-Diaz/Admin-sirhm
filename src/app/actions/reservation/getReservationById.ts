"use server";

import prisma from "@/lib/db";
import { BookingsStatus } from "@prisma/client";

export interface RoomDetailDTO {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  image: string | null;
  nights: number;
  subtotal: number;
}

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
  imageUrl?: string | null;
  roomDetails: RoomDetailDTO[];
  totalAmount: number;
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
            price: true,
            dateStart: true,
            dateEnd: true,
            guestQuantity: true,
            bedrooms_id: true,
            Bedrooms: {
              select: {
                id: true,
                TypeBedrooms: { select: { nameType: true } },
                description: true,
                capacity: true,
                galleryImages: {
                  select: {
                    id: true,
                    imageContent: true,
                  },
                },
              },
            },
            promotion_id: true,
            Promotions: { select: { codePromotions: true } },
          },
        },
      },
    });

    if (!reservation) return null;

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

    // Construir detalles de habitaciones
    const roomDetails: RoomDetailDTO[] = details.map((d) => {
      const start = d.dateStart ? new Date(d.dateStart) : minStart;
      const end = d.dateEnd ? new Date(d.dateEnd) : maxEnd;

      const nights =
        start && end
          ? Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
          : 0;

      const price = d.price ?? 0;
      const subtotal = price * nights;

      if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);
      const typeName = d.Bedrooms?.TypeBedrooms?.nameType;
      if (typeName) bedroomNamesSet.add(typeName);

      const firstImage = d.Bedrooms?.galleryImages?.[0]?.imageContent ?? null;

      return {
        id: d.Bedrooms?.id ?? 0,
        name: d.Bedrooms?.TypeBedrooms?.nameType ?? "Habitación",
        description: d.Bedrooms?.description ?? "",
        capacity: d.Bedrooms?.capacity ?? 0,
        price: price,
        image: firstImage,
        nights: nights,
        subtotal: subtotal,
      };
    });

    const rooms = uniqueBedroomIds.size;
    const bedroomsType = Array.from(bedroomNamesSet).join(", ");
    const totalAmount = roomDetails.reduce((acc, r) => acc + r.subtotal, 0);

    const promoSet = new Set<string>();
    details.forEach((d) => {
      const code = d.Promotions?.codePromotions;
      if (code) promoSet.add(code);
    });

    const offerts = promoSet.size
      ? Array.from(promoSet).join(", ")
      : null;

    const promotionId =
      details.find((d) => d.promotion_id != null)?.promotion_id ?? null;

    const username = reservation.User?.username ?? "";
    const [firstName, ...lastParts] = username.split(" ");
    const lastName = lastParts.join(" ");

    // Primera imagen para el fallback o vista general si se requiere
    const imageUrl = roomDetails.find(r => r.image)?.image ?? null;

    return {
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
      imageUrl,
      roomDetails,
      totalAmount
    };
  } catch (error) {
    console.error("Error al obtener la reservación", error);
    return null;
  }
};
