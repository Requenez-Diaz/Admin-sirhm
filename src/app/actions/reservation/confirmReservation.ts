"use server";

import prisma from "@/lib/db";
import { BookingsStatus } from "@prisma/client";
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
            Bedrooms: { select: { TypeBedrooms: { select: { nameType: true } } } },
          },
        },
      },
    });

    if (!reservation)
      return { success: false, message: "Reservación no encontrada." };

    // Definir el nuevo estado de la reserva
    let newStatus: BookingsStatus;
    if (reservation.status === BookingsStatus.CANCELLED) {
      newStatus = BookingsStatus.PENDING;
    } else if (reservation.status === BookingsStatus.PENDING) {
      newStatus = BookingsStatus.CONFIRMED;
    } else {
      return { success: false, message: "No se puede modificar esta reserva." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.reservation.update({
        where: { id: reservationId },
        data: { status: newStatus },
      });

      if (newStatus === BookingsStatus.CONFIRMED) {
        const bedroomIds = reservation.ReservationDetails.map(
          (d) => d.bedrooms_id,
        );
        await tx.bedrooms.updateMany({
          where: { id: { in: bedroomIds } },
          data: { status: false },
        });
      }
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/bedrooms");
    return {
      success: true,
      message: "Reserva confirmada y habitación ocupada.",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error al confirmar reservación." };
  }
}
