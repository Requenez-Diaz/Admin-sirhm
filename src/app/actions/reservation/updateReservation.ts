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
        await prisma.reservation.update({
            where: {
                id: parseInt(reservationId),
            },
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

        revalidatePath("/dashboard/bookings");
        return { success: true, message: "La reservación se actualizó correctamente." };

    } catch (error) {
        console.error("Error al actualizar la reservación: ", error);
        return { success: false, message: "Error al actualizar la reservación." };
    }
};
