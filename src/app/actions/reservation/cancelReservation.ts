// app/actions/reservation.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function cancelReservation(reservationId: number) {
  try {
    // 1. Verificamos si existe la reservación
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation) {
      return { success: false, message: "Reservación no encontrada." };
    }

    // 2. Usamos una transacción para cambiar el estado en ambas tablas
    // Esto NO elimina la fila, solo cambia el texto de la columna 'status'
    await prisma.$transaction([
      // Actualiza la tabla principal 'Reservation'
      prisma.reservation.update({
        where: { id: reservationId },
        data: { status: "CANCELLED" }, 
      }),
      // Actualiza todos los detalles asociados en 'ReservationDetails'
      prisma.reservationDetails.updateMany({
        where: { reservation_id: reservationId },
        data: { status: "CANCELLED" },
      }),
    ]);

    // 3. Refrescamos la ruta para que la tabla en el cliente se actualice
    revalidatePath("/dashboard/bookings");

    return { 
      success: true, 
      message: "La reservación ha sido marcada como cancelada." 
    };
  } catch (error) {
    console.error("Error al cancelar:", error);
    return { success: false, message: "Hubo un error al intentar cancelar la reservación." };
  }
}