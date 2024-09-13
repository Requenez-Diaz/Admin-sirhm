"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
    try {
        // Actualiza el estado de la reservación a "CONFIRMED"
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: 'CONFIRMED' },
        });
        revalidatePath('/dashboard/bookings');

        return { success: true, message: 'Reservación confirmada.' };
    } catch (error) {
        console.error('Error al confirmar la reservación:', error);
        return { success: false, message: 'Error al confirmar la reservación.' };
    }
}