"use server";

import prisma from "@/lib/db";

export async function getLastReservationByClient(
  reservationId?: string,
  clientName?: string,
) {
  try {
    const whereCondition: any = {
      status: "CONFIRMED",
    };

    if (reservationId) {
      whereCondition.id = parseInt(reservationId);
    } else if (clientName) {
      whereCondition.User = {
        username: {
          contains: clientName,
          mode: "insensitive",
        },
      };
    }

    const reservation = await prisma.reservation.findFirst({
      where: whereCondition,
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        ReservationDetails: {
          include: {
            Bedrooms: {
              include: { TypeBedrooms: true },
            },
          },
        },
      },
    });

    if (!reservation)
      return { success: false, error: "No se encontró reservación confirmada" };

    return { success: true, data: reservation };
  } catch (error) {
    return { success: false, error: "Error en el servidor de base de datos" };
  }
}
