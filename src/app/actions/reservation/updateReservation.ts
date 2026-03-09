"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { calculateDuration } from "./calculateDuration";

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
  const {
    reservationId,
    name,
    email,
    bedroomsType,
    guests,
    arrivalDate,
    departureDate,
  } = data;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(reservationId) },
      include: { ReservationDetails: true }
    });

    if (!reservation) {
      return { success: false, message: "No se encontró la reservación." };
    }

    // Normalizar fechas a 00:00:00
    const normArrivalDate = new Date(arrivalDate);
    normArrivalDate.setHours(0, 0, 0, 0);
    const normDepartureDate = new Date(departureDate);
    normDepartureDate.setHours(0, 0, 0, 0);

    const bedroom = await prisma.bedroom.findFirst({
      where: {
        TypeBedrooms: {
          nameType: bedroomsType
        }
      }
    });

    if (!bedroom) {
      return { success: false, message: "El tipo de habitación no es válido." };
    }

    await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos del usuario
      await tx.user.update({
        where: { id: reservation.user_id },
        data: {
          username: name,
          email: email,
        },
      });

      // 2. Calcular nuevas noches y subtotal
      const nights = calculateDuration(normArrivalDate, normDepartureDate);
      const subtotal = (bedroom.lowSeasonPrice ?? 0) * (nights || 1);

      // 3. Actualizar todos los detalles de la reservación
      await tx.reservationDetails.updateMany({
        where: { reservation_id: parseInt(reservationId) },
        data: {
          guestQuantity: parseInt(guests),
          dateStart: normArrivalDate,
          dateEnd: normDepartureDate,
          bedrooms_id: bedroom.id,
          price: subtotal, // Guardamos el subtotal (Noches * Precio)
        },
      });
    });

    revalidatePath("/dashboard/bookings");
    return {
      success: true,
      message: "La reservación se actualizó correctamente.",
    };
  } catch (error) {
    console.error("Error al actualizar la reservación: ", error);
    return { success: false, message: "Error interno al actualizar." };
  }
};