"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateReservation(formData: FormData) {
    const reservationId = formData.get("reservationId")?.toString();
    const name = formData.get("name")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const email = formData.get("email")?.toString();
    const bedroomsType = formData.get("bedroomsType")?.toString();
    const guests = formData.get("guests")?.toString() ?? "";
    const rooms = formData.get("rooms")?.toString() ?? "";
    const arrivalDate = formData.get("arrivalDate")?.toString();
    const departureDate = formData.get("departureDate")?.toString();

    if (!reservationId) {
        console.error("No se encontró la reservación");
        return;
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
                arrivalDate: new Date(arrivalDate ?? ""),
                departureDate: new Date(departureDate ?? ""),
            },
        });
        revalidatePath("/dashboard/bookings");

    } catch (error) {
        console.error("Error al actualizar la reservación: ", error);
        return { success: false, message: "Error al actualizar la reservación." };

    }

}