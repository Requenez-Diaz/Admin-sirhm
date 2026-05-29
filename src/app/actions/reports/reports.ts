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
        status: "CONFIRMED",
        ...(start || adjustedEnd
          ? {
              ReservationDetails: {
                some: {
                  AND: [
                    ...(adjustedEnd
                      ? [{ dateStart: { lte: adjustedEnd } }]
                      : []),
                    ...(start ? [{ dateEnd: { gte: start } }] : []),
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

    const data = reservations.map((res) => {
      const activeDetails = res.ReservationDetails.filter(
        (d) => d.status !== "CANCELLED",
      );

      const totalMontoReserva = activeDetails.reduce(
        (acc, d) => acc + (d.price ?? 0),
        0,
      );
      globalTotalRevenue += totalMontoReserva;
      activeDetails.forEach((d) =>
        uniqueOccupiedRooms.add(d.bedrooms_id),
      );

      const firstDetail = activeDetails[0];
      const estancia = firstDetail
        ? `${new Date(firstDetail.dateStart).toLocaleDateString("es-ES")} - ${new Date(firstDetail.dateEnd).toLocaleDateString("es-ES")}`
        : "N/A";

      return {
        id: res.id,
        fecha: res.createdAt
          ? new Date(res.createdAt).toISOString()
          : new Date().toISOString(),
        estancia: estancia,
        cliente: res.User?.username || "N/A",
        email: res.User?.email || "N/A",
        monto: totalMontoReserva,
        habitaciones: activeDetails.map(
          (d) => d.Bedrooms.numberBedroom,
        ).join(", "),
      };
    });

    return {
      success: true,
      data,
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
