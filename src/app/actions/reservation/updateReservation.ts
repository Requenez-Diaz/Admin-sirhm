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

    const bedroom = await prisma.bedrooms.findFirst({
      where: {
        TypeBedrooms: {
          nameType: bedroomsType
        }
      }
    });

    if (!bedroom) {
      return { success: false, message: "El tipo de habitación no es válido." };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: reservation.user_id },
        data: {
          username: name,
          email: email,
        },
      }),


      prisma.reservationDetails.updateMany({
        where: { reservation_id: parseInt(reservationId) },
        data: {
          guestQuantity: parseInt(guests),
          dateStart: new Date(arrivalDate),
          dateEnd: new Date(departureDate),
          bedrooms_id: bedroom.id,
        },
      }),
    ]);

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