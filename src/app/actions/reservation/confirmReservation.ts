"use server";

import prisma from "@/lib/db";
import { BookingsStatus, NotificationType } from "@prisma/client"; // ajusta si tu enum de notificaciones se llama distinto
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        User: true,
        ReservationDetails: {
          select: { Bedrooms: { select: { typeBedroom: true } } },
        },
      },
    });

    if (!reservation) {
      return { success: false, message: "Reservación no encontrada." };
    }

    let newStatus: BookingsStatus;
    if (reservation.status === BookingsStatus.CANCELLED) {
      newStatus = BookingsStatus.PENDING;
    } else if (reservation.status === BookingsStatus.PENDING) {
      newStatus = BookingsStatus.CONFIRMED;
    } else {
      return {
        success: false,
        message: "No se puede confirmar esta reservación.",
      };
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status: newStatus },
    });

    const { User: user } = reservation;
    const bedroomName =
      reservation.ReservationDetails?.[0]?.Bedrooms?.typeBedroom ??
      "habitación";

    if (newStatus === BookingsStatus.CONFIRMED) {
      await prisma.notification.create({
        data: {
          title: "Reservación confirmada",
          message: `Tu reservación para una ${bedroomName} ha sido confirmada.`,
          email: user?.email ?? null,
          userId: reservation.user_id,
          reservationId: reservation.id,
          type: NotificationType.CONFIRMED,
        },
      });
    }

    revalidatePath("/dashboard/bookings");

    return {
      success: true,
      message: `Reservación actualizada a ${newStatus}.`,
    };
  } catch (error) {
    console.error("Error en confirmReservation:", error);
    return { success: false, message: "Error al confirmar la reservación." };
  }
}
