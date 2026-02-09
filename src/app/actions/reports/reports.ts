"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getReservationReport(
  startDate?: string,
  endDate?: string,
) {
  try {
    const totalRoomsCount = await prisma.bedrooms.count();

    const dateFilter =
      startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {};

    const users = await prisma.user.findMany({
      select: {
        username: true,
        email: true,
        Reservation: {
          where: dateFilter,
          include: { ReservationDetails: true },
        },
      },
    });

    let globalTotalRevenue = 0;
    const uniqueOccupiedRooms = new Set();

    const reportData = users
      .map((user) => {
        let userSpent = 0;
        const userRooms = new Set();

        user.Reservation.forEach((res) => {
          res.ReservationDetails.forEach((detail) => {
            userSpent += detail.price;
            userRooms.add(detail.bedrooms_id);
            uniqueOccupiedRooms.add(detail.bedrooms_id);
          });
        });

        globalTotalRevenue += userSpent;

        return {
          Cliente: user.username,
          Email: user.email,
          Total_Gastado: userSpent,
          Hab_Ocupadas: userRooms.size,
          Frecuencia: user.Reservation.length,
        };
      })
      .filter((u) => u.Frecuencia > 0 || !startDate);

    return {
      success: true,
      data: reportData,
      metrics: {
        ingresosTotales: globalTotalRevenue,
        tasaOcupacion:
          totalRoomsCount > 0
            ? ((uniqueOccupiedRooms.size / totalRoomsCount) * 100).toFixed(1)
            : "0",
        totalHabitaciones: totalRoomsCount,
        conteoOcupadas: uniqueOccupiedRooms.size,
      },
    };
  } catch (error) {
    return { success: false, error: "Error al generar el reporte" };
  }
}
