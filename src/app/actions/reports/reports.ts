"use server";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getReservationReport(
  startDate?: string,
  endDate?: string,
) {
  try {
    const totalRoomsCount = await prisma.bedrooms.count();

    let dateFilter = {};

    if (startDate || endDate) {
      const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
      const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null;

      dateFilter = {
        createdAt: {
          ...(start && { gte: start }),
          ...(end && { lte: end }),
        },
      };
    }

    const reservations = await prisma.reservation.findMany({
      where: dateFilter,
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
      const totalMontoReserva = res.ReservationDetails.reduce(
        (acc, d) => acc + d.price,
        0,
      );
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
