"use server";

import prisma from "@/lib/db";

// Obtener reservaciones, opcionalmente solo las no leídas
export const getReservations = async (onlyUnread?: boolean) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: onlyUnread ? { isRead: false } : {},
      orderBy: { createdAt: "desc" },
    });
    return reservations;
  } catch (error) {
    console.error("Error al obtener las reservas", error);
    return [];
  }
};

// Marcar todas las reservaciones como leídas
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
