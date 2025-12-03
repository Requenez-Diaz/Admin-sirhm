"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateReservation = async (data: {
  reservationId: string;
  email: string;
  bedroomsId: string;
  guests: string;
  arrivalDate: string;
  departureDate: string;
}) => {

  const {
    reservationId,
    email,
    bedroomsId,
    guests,
    arrivalDate,
    departureDate,
  } = data;

  try {
    // Validar datos de entrada
    const guestsNum = parseInt(guests);
    const bedroomIdNum = parseInt(bedroomsId);
    const resIdNum = parseInt(reservationId);

    if (isNaN(guestsNum) || guestsNum < 1) {
      return { success: false, message: "Número de huéspedes inválido." };
    }

    if (isNaN(bedroomIdNum) || isNaN(resIdNum)) {
      return { success: false, message: "Datos de reservación inválidos." };
    }

    // Validar fechas
    const startDate = new Date(arrivalDate);
    const endDate = new Date(departureDate);

    if (startDate >= endDate) {
      return { success: false, message: "La fecha de salida debe ser posterior a la fecha de llegada." };
    }

    // 1. Obtener reservación
    const reservation = await prisma.reservation.findUnique({
      where: { id: resIdNum },
      include: { User: true, ReservationDetails: true },
    });

    if (!reservation) {
      return { success: false, message: "Reservación no encontrada." };
    }

    if (!reservation.ReservationDetails || reservation.ReservationDetails.length === 0) {
      return { success: false, message: "Detalles de reservación no encontrados." };
    }

    // 2. Verificar capacidad de la habitación
    const bedroom = await prisma.bedrooms.findUnique({
      where: { id: bedroomIdNum },
      select: { capacity: true, typeBedroom: true },
    });

    if (!bedroom) {
      return { success: false, message: "Habitación no encontrada." };
    }

    if (guestsNum > bedroom.capacity) {
      return { success: false, message: `La habitación ${bedroom.typeBedroom} tiene capacidad máxima de ${bedroom.capacity} huéspedes.` };
    }

    // 3. Actualizar email del usuario si cambió
    if (reservation.User.email !== email) {
      await prisma.user.update({
        where: { id: reservation.user_id },
        data: { email },
      });
    }

    // 4. Actualizar ReservationDetails
    await prisma.reservationDetails.update({
      where: { id: reservation.ReservationDetails[0].id },
      data: {
        bedrooms_id: bedroomIdNum,
        guestQuantity: guestsNum,
        dateStart: startDate,
        dateEnd: endDate,
      }
    });

    revalidatePath("/dashboard/bookings");

    return { success: true, message: "Reservación actualizada correctamente." };

  } catch (error) {
    console.error("Error al actualizar la reservación:", error);
    return { success: false, message: "Error al actualizar la reservación." };
  }
};
