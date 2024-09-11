"use server";

import prisma from "@/lib/db";

export async function deleteReservation(formData: FormData) {
    const reservationId = formData.get("reservationId")?.toString();

    if (!reservationId) {
        console.error("No se encontró la reservación");
        return;
    }

    try {
        await prisma.reservation.delete({
            where: {
                id: parseInt(reservationId),
            },
        });

        console.log(`Reservación con ID ${reservationId} eliminada exitosamente`);
        return { success: true, message: "Reservación eliminada correctamente" };
    } catch (error) {
        console.error(`Error al eliminar la reservación con ID ${reservationId}:`, error);
        return { success: false, message: "Error al eliminar la reservación" };
    }
}