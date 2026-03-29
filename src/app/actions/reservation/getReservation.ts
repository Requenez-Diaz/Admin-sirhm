"use server";

import prisma from "@/lib/db";

// Tipo de estado de booking para el cliente
type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

// DTO que el cliente espera en la tabla
export type RoomDetail = {
  id: number;
  name: string;
  status: BookingStatus;
  price: number;
  dateStart: string | null;
  dateEnd: string | null;
};

export type ReservationRow = {
  id: number;
  status: BookingStatus;
  userName: string;
  lastName: string;
  email: string | null;
  guests: number;
  rooms: number;
  bedroomsType: string;
  arrivalDate: string | null;
  departureDate: string | null;
  offert: string | null;
  totalPrice: number;
  isInvoiced: boolean;
  roomDetails: RoomDetail[];
};

export const getReservations = async (): Promise<ReservationRow[]> => {
  try {
    const today = new Date();

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

    const invoices = await prisma.invoice.findMany({
      where: {
        reservationId: { in: reservations.map((r) => r.id) },
      } as any,
    });

    const invoiceMap = new Map(
      (invoices as any[]).map((inv) => [inv.reservationId as number, true]),
    );

    const formatted: ReservationRow[] = reservations.map((reservation) => {
      const details = reservation.ReservationDetails ?? [];

      // Filter only active (non-cancelled) details
      const activeDetails = details.filter((d) => d.status !== "CANCELLED");

      // Extract and filter dates
      const starts = activeDetails
        .map((d) => d.dateStart)
        .filter((d): d is Date => !!d);
      const ends = activeDetails
        .map((d) => d.dateEnd)
        .filter((d): d is Date => !!d);

      const minStart = starts.length
        ? new Date(Math.min(...starts.map((d) => d.getTime())))
        : null;

      const maxEnd = ends.length
        ? new Date(Math.max(...ends.map((d) => d.getTime())))
        : null;

      // Calculate totals
      const guests = activeDetails.reduce(
        (acc, d) => acc + (d.guestQuantity ?? 0),
        0,
      );

      const uniqueBedroomIds = new Set<number>();
      const bedroomTypesSet = new Set<string>();

      activeDetails.forEach((d) => {
        if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);

        const typeName = d.Bedrooms?.TypeBedrooms?.nameType;
        if (typeName) bedroomTypesSet.add(typeName);
      });

      const rooms = uniqueBedroomIds.size;
      const bedroomsType = Array.from(bedroomTypesSet).join(", ") || "Sin tipo";

      // Promotions
      const promoSet = new Set<string>();
      activeDetails.forEach((d) => {
        const code = d.Promotions?.codePromotions;
        if (code) promoSet.add(code);
      });
      const offert = promoSet.size ? Array.from(promoSet).join(", ") : null;

      // Total Price Calculation (Direct sum as price already includes nights)
      const totalPrice = activeDetails.reduce(
        (acc, d) => acc + (d.price ?? 0),
        0,
      );

      // Is Invoiced Check - specific to this reservation
      const isInvoiced = invoiceMap.has(reservation.id);

      const fullName = reservation.User?.username ?? "";
      const [firstName, ...lastParts] = fullName.split(" ");
      const lastName = lastParts.join(" ");

      const roomDetails: RoomDetail[] = details.map((d) => ({
        id: d.id,
        name: d.Bedrooms?.TypeBedrooms?.nameType || "Habitación",
        status: d.status as BookingStatus,
        price: d.price ?? 0,
        dateStart: d.dateStart ? d.dateStart.toISOString() : null,
        dateEnd: d.dateEnd ? d.dateEnd.toISOString() : null,
      }));

      return {
        id: reservation.id,
        status: reservation.status as BookingStatus,
        userName: firstName || fullName || "Usuario desconocido",
        lastName: lastName || "—",
        email: reservation.User?.email ?? null,
        guests,
        rooms,
        bedroomsType,
        arrivalDate: minStart ? minStart.toISOString() : null,
        departureDate: maxEnd ? maxEnd.toISOString() : null,
        offert: offert,
        totalPrice,
        isInvoiced,
        roomDetails,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    return [];
  }
};
