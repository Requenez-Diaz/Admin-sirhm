"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const parseSafeDate = (d: string | Date) => {
  const iso = typeof d === "string" ? d : new Date(d).toISOString();
  const [y, m, day] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, day, 0, 0, 0, 0);
};



export async function getReservationReport(
  startDate?: string,
  endDate?: string,
) {
  try {
    const totalRoomsCount = await prisma.bedroom.count();

    const start = startDate ? parseSafeDate(startDate) : null;
    const end = endDate ? parseSafeDate(endDate) : null;

    // Ajustamos el "end" para que sea el final del día si existe
    const adjustedEnd = end
      ? new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999,
      )
      : null;

    const reservations = await prisma.reservation.findMany({
      where: {
        status: "CONFIRMED", // Normalmente solo contamos las confirmadas en reportes de ingresos
        ...(start || adjustedEnd
          ? {
            ReservationDetails: {
              some: {
                AND: [
                  ...(start ? [{ dateEnd: { gt: start } }] : []),
                  ...(adjustedEnd
                    ? [{ dateStart: { lt: adjustedEnd } }]
                    : []),
                ],
              },
            },
          }
          : {}),
      },
      include: {
        User: true,
        ReservationDetails: {
          include: { Bedrooms: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let globalTotalRevenue = 0;
    const uniqueOccupiedRooms = new Set();
    const reservationsList = reservations.map((res) => {
      const totalMontoReserva = res.ReservationDetails.reduce((acc, d) => {
        return acc + (d.price ?? 0);
      }, 0);
      globalTotalRevenue += totalMontoReserva;
      res.ReservationDetails.forEach((d) =>
        uniqueOccupiedRooms.add(d.bedrooms_id),
      );
      return {
        id: res.id,
        fecha: res.createdAt.toISOString(),
        cliente: res.User?.username || "N/A",
        email: res.User?.email || "N/A",
        monto: totalMontoReserva,
        habitaciones: res.ReservationDetails.map(
          (d) => d.Bedrooms.numberBedroom,
        ).join(", "),
      };
    });

    return {
      success: true,
      data: reservationsList,
      metrics: {
        ingresosTotales: globalTotalRevenue,
        tasaOcupacion:
          totalRoomsCount > 0
            ? ((uniqueOccupiedRooms.size / totalRoomsCount) * 100).toFixed(1)
            : "0",
        totalReservas: reservations.length,
        conteoOcupadas: uniqueOccupiedRooms.size,
      },
    };
  } catch (error) {
    console.error("Error en reporte:", error);
    return { success: false, error: "Error al obtener las reservaciones" };
  }
}
