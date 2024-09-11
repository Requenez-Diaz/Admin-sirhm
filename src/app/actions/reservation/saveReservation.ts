"use server";

import prisma from "@/lib/db";
import { Status } from "@prisma/client";

export const saveReservation = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const bedroomsType = formData.get("bedroomsType") as string;
    const guests = Number(formData.get("guests"));
    const rooms = Number(formData.get("rooms"))
    const arrivalDate = new Date(formData.get("arrivalDate") as string);
    const departureDate = new Date(formData.get("departureDate") as string);

    if (!name || !lastName || !email || !bedroomsType || isNaN(guests) ||isNaN(rooms) || !arrivalDate || !departureDate) {
        throw new Error("Todos los campos son obligatorios.");
    }

    try {
        const newReservation = await prisma.reservation.create({
            data: {
                name,
                lastName,
                email,
                bedroomsType,
                guests,
                rooms,
                arrivalDate,
                departureDate,
                status: Status.PENDING,
            },
        });

        console.log("Reserva guardada con éxito", newReservation);
        return {
            success: true,
            message: "La reserva se registró correctamente.",
        };
    } catch (error) {
        console.error("Error al guardar la reserva", error);
        return { success: false, message: "Error al guardar la reserva" };
    }
};