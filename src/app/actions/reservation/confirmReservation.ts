"use server";

import prisma from "@/lib/db";
import { BookingsStatus, NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        User: true,
        ReservationDetails: {
          select: {
            bedrooms_id: true,
            Bedrooms: { select: { typeBedroom: true } },
          },
        },
      },
    });

    if (!reservation)
      return { success: false, message: "Reservación no encontrada." };

    let newStatus: BookingsStatus;
    if (reservation.status === BookingsStatus.CANCELLED) {
      newStatus = BookingsStatus.PENDING;
    } else if (reservation.status === BookingsStatus.PENDING) {
      newStatus = BookingsStatus.CONFIRMED;
    } else {
      return { success: false, message: "Estado actual no permite cambios." };
    }

    // Transacción atómica: o se actualiza todo o nada
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar reserva
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: newStatus },
      });

      // 2. Si se confirma, marcar habitaciones como Ocupadas (false)
      if (newStatus === BookingsStatus.CONFIRMED) {
        const bedroomIds = reservation.ReservationDetails.map(
          (d) => d.bedrooms_id,
        );
        await tx.bedrooms.updateMany({
          where: { id: { in: bedroomIds } },
          data: { status: false }, // false representa "Ocupado" en tu lógica actual
        });
      }
    });

    // Notificación
    if (newStatus === BookingsStatus.CONFIRMED) {
      const bedroomName =
        reservation.ReservationDetails?.[0]?.Bedrooms?.typeBedroom ??
        "habitación";
      await prisma.notification.create({
        data: {
          title: "¡Reservación Confirmada!",
          message: `Tu reserva para ${bedroomName} ha sido confirmada y la habitación ha sido asignada.`,
          userId: reservation.user_id,
          reservationId: reservation.id,
          type: NotificationType.CONFIRMED,
          email: reservation.User?.email,
        },
      });
    }

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/bedrooms");
    return {
      success: true,
      message: `Reserva confirmada y habitación ocupada.`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al procesar la confirmación." };
  }
}
