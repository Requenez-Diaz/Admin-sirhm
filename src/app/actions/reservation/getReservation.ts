"use server";

import prisma from "@/lib/db";

export const getReservations = async (onlyUnread?: boolean) => {
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
      where: onlyUnread ? { isRead: false } : {},
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

export const markAllAsRead = async () => {
  try {
    await prisma.reservation.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  } catch (error) {
    console.error("Error al marcar reservas como leídas", error);
  }
};
