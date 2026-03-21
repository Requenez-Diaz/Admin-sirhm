// app/actions/reservation.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cancelReservation(
  reservationId: number,
  detailId?: number,
) {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { ReservationDetails: true },
    });

    if (!reservation) {
      return { success: false, message: "Reservación no encontrada." };
    }

    if (detailId !== undefined) {
      // Cancelación parcial: solo una habitación específica
      const detail = reservation.ReservationDetails.find(
        (d) => d.id === detailId,
      );
      if (!detail) {
        return { success: false, message: "Habitación no encontrada." };
      }

      await prisma.$transaction([
        prisma.reservationDetails.update({
          where: { id: detailId },
          data: { status: "CANCELLED" },
        }),
      ]);

      const remainingActive = reservation.ReservationDetails.filter(
        (d) => d.id !== detailId && d.status !== "CANCELLED",
      );

      if (remainingActive.length === 0) {
        await prisma.reservation.update({
          where: { id: reservationId },
          data: { status: "CANCELLED" },
        });
      }

      revalidatePath("/dashboard/bookings");
      return { success: true, message: "Habitación cancelada correctamente." };
    } else {
      // Cancelación completa: todas las habitaciones
      await prisma.$transaction([
        prisma.reservation.update({
          where: { id: reservationId },
          data: { status: "CANCELLED" },
        }),
        prisma.reservationDetails.updateMany({
          where: { reservation_id: reservationId },
          data: { status: "CANCELLED" },
        }),
      ]);

      revalidatePath("/dashboard/bookings");
      return {
        success: true,
        message: "La reservación ha sido marcada como cancelada.",
      };
    }
  } catch (error) {
    console.error("Error al cancelar:", error);
    return {
      success: false,
      message: "Hubo un error al intentar cancelar la reservación.",
    };
  }
}
