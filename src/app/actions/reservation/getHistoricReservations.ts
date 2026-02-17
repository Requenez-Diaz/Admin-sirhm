"use server";

import prisma from "@/lib/db";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | string;

export type HistoricReservationRow = {
  id: number;
  userName: string;
  userEmail: string | null;
  userImage: string | null;
  bedroomsType: string;
  rooms: number;
  guests: number;
  arrivalDate: string | null;
  departureDate: string | null;
  finalStatus: BookingStatus;
  offerts: string | null;
  createdAt: string;
};

export const getHistoricReservations = async (): Promise<
  HistoricReservationRow[]
> => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const reservations = await prisma.reservation.findMany({
      where: {
        ReservationDetails: {
          some: {
            dateEnd: { lt: today },
            // dateStart: { lt: today }, // <-- alternativa si así defines “histórico”
          },
        },
        status: { in: ["CONFIRMED", "PENDING", "CANCELLED"] },
      },
      orderBy: { createdAt: "desc" },
      include: {
        User: { select: { username: true, image: true, email: true } },
        ReservationDetails: {
          select: {
            dateStart: true,
            dateEnd: true,
            guestQuantity: true,
            Bedrooms: {
              select: {
                id: true,
                TypeBedrooms: { select: { nameType: true } }
              }
            },
            Promotions: { select: { codePromotions: true } },
          },
        },
      },
    });

    const formatted: HistoricReservationRow[] = reservations.map((r) => {
      const details = r.ReservationDetails ?? [];

      // Fechas: mínimo inicio y máximo fin
      const starts = details.map((d) => d.dateStart).filter(Boolean) as Date[];
      const ends = details.map((d) => d.dateEnd).filter(Boolean) as Date[];

      const minStart = starts.length
        ? new Date(Math.min(...starts.map((d) => new Date(d).getTime())))
        : null;

      const maxEnd = ends.length
        ? new Date(Math.max(...ends.map((d) => new Date(d).getTime())))
        : null;

      // Invitados: suma guestQuantity
      const guests = details.reduce(
        (acc, d) => acc + (d.guestQuantity ?? 0),
        0
      );

      // Habitaciones: contar únicas y reunir nombres
      const uniqueBedroomIds = new Set<number>();
      const bedroomNamesSet = new Set<string>();

      details.forEach((d) => {
        if (d.Bedrooms?.id) uniqueBedroomIds.add(d.Bedrooms.id);
        const typeName = d.Bedrooms?.TypeBedrooms?.nameType;
        if (typeName) bedroomNamesSet.add(typeName);
      });

      const rooms = uniqueBedroomIds.size;
      const bedroomsType = Array.from(bedroomNamesSet).join(", ");

      const promoSet = new Set<string>();
      details.forEach((d) => {
        const code = d.Promotions?.codePromotions;
        if (code) promoSet.add(code);
      });
      const offerts = promoSet.size ? Array.from(promoSet).join(", ") : null;

      // Usuario desde la relación 'User'
      const userName = r.User?.username ?? "Usuario desconocido";
      const userEmail = r.User?.email ?? null;
      const userImage = r.User?.image ?? null;

      let finalStatus: BookingStatus = r.status as BookingStatus;

      // Si cualquiera de los 'ends' es < today, consideramos histórica. Ya lo filtra el where.
      const hasEndedInPast = ends.some((end) => end && end < today);

      if (hasEndedInPast) {
        if (r.status === "CONFIRMED") finalStatus = "COMPLETED";
        else if (r.status === "PENDING") finalStatus = "EXPIRED";
        else if (r.status === "CANCELLED") finalStatus = "CANCELLED";
      }

      return {
        id: r.id,
        userName,
        userEmail,
        userImage,
        bedroomsType,
        rooms,
        guests,
        arrivalDate: minStart ? minStart.toISOString() : null,
        departureDate: maxEnd ? maxEnd.toISOString() : null,
        finalStatus,
        offerts,
        createdAt: r.createdAt.toISOString(),
      };
    });

    return formatted;
  } catch (error) {
    console.error("Error cargando historial:", error);
    return [];
  }
};
