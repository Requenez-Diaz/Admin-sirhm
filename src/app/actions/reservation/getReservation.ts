"use server";

import prisma from "@/lib/db";
import { calculateDuration } from "./calculateDuration";

// Tipo de estado de booking para el cliente
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
  totalPrice: number;
  isInvoiced: boolean;
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

    const invoices = await prisma.invoce.findMany({
      where: {
        clientId: { in: reservations.map((r) => r.user_id) },
      },
    });

    const formatted: ReservationRow[] = reservations.map((reservation) => {
      const details = reservation.ReservationDetails ?? [];

      // Extract and filter dates
      const starts = details.map((d) => d.dateStart).filter((d): d is Date => !!d);
      const ends = details.map((d) => d.dateEnd).filter((d): d is Date => !!d);

      const minStart = starts.length
        ? new Date(Math.min(...starts.map((d) => d.getTime())))
        : null;

      const maxEnd = ends.length
        ? new Date(Math.max(...ends.map((d) => d.getTime())))
        : null;

      // Calculate totals
      const guests = details.reduce((acc, d) => acc + (d.guestQuantity ?? 0), 0);

      const uniqueBedroomIds = new Set<number>();
      const bedroomTypesSet = new Set<string>();

      details.forEach((d) => {
        if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);

        const typeName = d.Bedrooms?.TypeBedrooms?.nameType;
        if (typeName) bedroomTypesSet.add(typeName);
      });

      const rooms = uniqueBedroomIds.size;
      const bedroomsType = Array.from(bedroomTypesSet).join(", ") || "Sin tipo";

      // Promotions
      const promoSet = new Set<string>();
      details.forEach((d) => {
        const code = d.Promotions?.codePromotions;
        if (code) promoSet.add(code);
      });
      const offerts = promoSet.size ? Array.from(promoSet).join(", ") : null;

      // Total Price Calculation (Historic)
      const totalPrice = details.reduce((acc, d) => {
        const nights = calculateDuration(d.dateStart, d.dateEnd);
        return acc + ((d.price ?? 0) * (nights || 1));
      }, 0);

      // Is Invoiced Check
      const isInvoiced = invoices.some(
        (inv) => inv.clientId === reservation.user_id && inv.date >= reservation.createdAt
      );

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
        totalPrice,
        isInvoiced,
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error al obtener las reservas:", error);
    return [];
  }
};