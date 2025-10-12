"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateReservation = async (data: {
    reservationId: string;
    name: string;
    lastName: string;
    email: string;
    bedroomsType: string;
    guests: string;
    rooms: string;
    arrivalDate: string;
    departureDate: string;
}) => {
    const { reservationId, name, lastName, email, bedroomsType, guests, rooms, arrivalDate, departureDate } = data;

    if (!reservationId) {
        console.error("No se encontró la reservación");
        return { success: false, message: "No se encontró la reservación." };
    }

    try {
        const reservationIdNum = parseInt(reservationId);

        // Obtener la reservación antigua con su usuario
        const oldReservation = await prisma.reservation.findUnique({
            where: { id: reservationIdNum },
            include: { user: true },
        });

        if (!oldReservation) {
            return { success: false, message: "Reserva no encontrada." };
        }

        // Actualizar la reservación
        await prisma.reservation.update({
            where: { id: reservationIdNum },
            data: {
                name,
                lastName,
                email,
                bedroomsType,
                guests: parseInt(guests),
                rooms: parseInt(rooms),
                arrivalDate: new Date(arrivalDate),
                departureDate: new Date(departureDate),
            },
        });

        // Crear notificación si cambió el tipo de habitación
        if (bedroomsType && bedroomsType !== oldReservation.bedroomsType) {
            await prisma.notification.create({
                data: {
                    type: "ROOM_TYPE_CHANGED",
                    message: `El usuario ${oldReservation.user.username} cambió su tipo de habitación a "${bedroomsType}".`,
                    userId: oldReservation.userId,
                    reservationId: reservationIdNum,
                    isRead: false,
                },
            });
        }

        revalidatePath("/dashboard/bookings");

        return { success: true, message: "La reservación se actualizó correctamente." };

    } catch (error) {
        console.error("Error al actualizar la reservación: ", error);
        return { success: false, message: "Error al actualizar la reservación." };
    }
};
