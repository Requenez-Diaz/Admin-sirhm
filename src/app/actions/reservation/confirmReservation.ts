"use server";

import prisma from "@/lib/db";
import { Status } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function confirmReservation(reservationId: number) {
    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { user: true },
        });

        if (!reservation) {
            return { success: false, message: "Reservación no encontrada." };
        }

        let newStatus: Status;
        if (reservation.status === Status.CANCELLED) {
            newStatus = Status.PENDING;
        } else if (reservation.status === Status.PENDING) {
            newStatus = Status.CONFIRMED;
        } else {
            return { success: false, message: "No se puede confirmar esta reservación." };
        }

        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: newStatus },
        });

        if (newStatus === Status.CONFIRMED) {
            await prisma.notification.create({
                data: {
                    title: "Reservación confirmada",
                    message: `Tu reservación para una ${reservation.bedroomsType} ha sido confirmada.`,
                    email: reservation.email,
                    userId: reservation.userId,
                    reservationId: reservation.id,
                    type: "CONFIRMED",
                },
            });

        }

        revalidatePath("/dashboard/bookings");

        return { success: true, message: `Reservación actualizada a ${newStatus}.` };
    } catch (error) {
        return { success: false, message: "Error al confirmar la reservación." };
    }
}
