"use server";

import prisma from "@/lib/db";

export const getReservations = async () => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        Promotions: { select: { codePromotions: true } },
        user: {
          select: {
            username: true,
            image: true,
            email: true,
          },
        },
      },
    });

    const formattedReservations = reservations.map((reservation) => ({
      ...reservation,
      offerts: reservation.Promotions?.codePromotions || null,
      userName:
        reservation.user?.username ||
        `${reservation.name} ${reservation.lastName}`,
      userEmail: reservation.user?.email || reservation.email,
      userImage: reservation.user?.image || null,
      kind: "reservation",
    }));

    return formattedReservations;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return [];
  }
};
