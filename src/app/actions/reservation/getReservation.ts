"use server";

import prisma from "@/lib/db";

export const getReservations = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Promotions: {
          select: {
            codePromotions: true,
          },
        },
      },
    });

    const formattedReservations = reservations.map((reservation) => ({
      ...reservation,
      offerts: reservation.Promotions?.codePromotions || null,
    }));

    return formattedReservations;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return [];
  }
};
