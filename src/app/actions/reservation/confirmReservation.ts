"use server";

import prisma from "@/lib/db";
import { BookingsStatus, NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { User: true },  // <-- el nombre correcto según tu schema
        });

        if (!reservation) {
            return { success: false, message: "Reservación no encontrada." };
        }

        // Determinar nuevo estado
        let newStatus: BookingsStatus;
        if (reservation.status === BookingsStatus.CANCELLED) {
            newStatus = BookingsStatus.PENDING;
        } else if (reservation.status === BookingsStatus.PENDING) {
            newStatus = BookingsStatus.CONFIRMED;
        } else {
            return { success: false, message: "No se puede confirmar esta reservación." };
        }

        // Actualizar estado
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: newStatus },
        });

        // Crear notificación si se confirma
        if (newStatus === BookingsStatus.CONFIRMED) {
            await prisma.notification.create({
                data: {
                    title: "Reservación confirmada",
                    message: `Tu reservación ha sido confirmada.`,
                    email: reservation.User.email,
                    userId: reservation.User.id,
                    reservationId: reservation.id,
                    type: NotificationType.CONFIRMED,
                },
            });
        }

        revalidatePath("/dashboard/bookings");

        return { success: true, message: `Reservación actualizada a ${newStatus}.` };

    } catch (error) {
        console.error("Error al confirmar:", error);
        return { success: false, message: "Error al confirmar la reservación." };
    }
}
