"use server";

import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
    try {
        // Obtiene la reservación actual para verificar su estado
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
        });

        if (!reservation) {
            return { success: false, message: 'Reservación no encontrada.' };
        }

        // Actualiza el estado basado en el estado actual
        let newStatus: Status;
        if (reservation.status === Status.CANCELLED) {
            newStatus = Status.PENDING; // Si está cancelada, vuelve a pendiente
        } else if (reservation.status === Status.PENDING) {
            newStatus = Status.CONFIRMED; // Si está pendiente, cambia a confirmada
        } else {
            return { success: false, message: 'No se puede confirmar esta reservación.' };
        }

        // Actualiza la reservación con el nuevo estado
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: newStatus },
        });

        revalidatePath('/dashboard/bookings');

        return { success: true, message: `Reservación actualizada a ${newStatus}.` };
    } catch (error) {
        console.error('Error al confirmar la reservación:', error);
        return { success: false, message: 'Error al confirmar la reservación.' };
    }
}