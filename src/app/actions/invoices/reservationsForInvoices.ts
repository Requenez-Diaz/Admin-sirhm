"use server";

import prisma from "@/lib/db";

export async function getLastReservationByClient(clientId: string) {
  try {
    const id = parseInt(clientId);
    if (isNaN(id)) return { success: false };

    const reservation = await prisma.reservation.findFirst({
      where: {
        user_id: id,
        status: "CONFIRMED",
      },
      orderBy: { createdAt: "desc" },
      include: {
        ReservationDetails: {
          include: {
            Bedrooms: {
              include: {
                TypeBedrooms: true,
              },
            },
          },
        },
      },
    });

    if (!reservation || reservation.ReservationDetails.length === 0) {
      return { success: false, error: "No hay reservas confirmadas." };
    }

    return { success: true, data: reservation };
  } catch (error) {
    return { success: false, error: "Error de servidor." };
  }
}
