"use server";

import prisma from "@/lib/db";
import { BookingsStatus, Status } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { calculateDuration } from "./calculateDuration";

export const saveReservation = async (data: {
  name: string;
  lastName: string;
  email: string;
  bedroomsType: string;
  guests: number;
  rooms: number;
  arrivalDate: Date;
  departureDate: Date;
}) => {
  const {
    email,
    bedroomsType,
    guests,
    rooms,
    arrivalDate,
    departureDate,
  } = data;

  // Normalizar fechas a 00:00:00 para evitar problemas de precisión y zonas horarias
  const normArrivalDate = new Date(arrivalDate);
  normArrivalDate.setHours(0, 0, 0, 0);
  const normDepartureDate = new Date(departureDate);
  normDepartureDate.setHours(0, 0, 0, 0);

  try {
    // 1. Obtener todas las habitaciones del tipo solicitado
    const bedrooms = await prisma.bedroom.findMany({
      where: {
        TypeBedrooms: {
          nameType: bedroomsType
        }
      },
      include: {
        TypeBedrooms: true
      }
    });

    if (bedrooms.length === 0) {
      return {
        success: false,
        message: `No se encontraron habitaciones del tipo "${bedroomsType}".`,
      };
    }

    // 2. Buscar cuáles de esas habitaciones están ocupadas en el rango de fechas
    // Lógica de solapamiento estándar: (start1 < end2) AND (end1 > start2)
    const overlappingDetails = await prisma.reservationDetails.findMany({
      where: {
        bedrooms_id: { in: bedrooms.map(b => b.id) },
        status: { in: [Status.PENDING, Status.CONFIRMED] },
        dateStart: { lt: normDepartureDate },
        dateEnd: { gt: normArrivalDate },
      },
      select: { bedrooms_id: true, dateEnd: true }
    });

    const occupiedRoomIds = new Set(overlappingDetails.map(d => d.bedrooms_id));
    const availableRooms = bedrooms.filter(b => !occupiedRoomIds.has(b.id));

    // 3. Validar si hay suficientes habitaciones físicas disponibles
    if (availableRooms.length < rooms) {
      // Calcular la próxima fecha disponible basándose en cuándo se libera alguna habitación
      let nextAvailableDate: Date | null = null;
      if (overlappingDetails.length > 0) {
        const sortedDates = overlappingDetails
          .map(r => new Date(r.dateEnd))
          .sort((a, b) => a.getTime() - b.getTime());
        nextAvailableDate = sortedDates[0];
      }

      return {
        success: false,
        message: `Disponibilidad insuficiente. Solo quedan ${availableRooms.length} habitaciones de tipo "${bedroomsType}" para estas fechas.`,
        nextAvailableDate,
      };
    }

    // 4. Crear la reservación y sus detalles de forma atómica
    const result = await prisma.$transaction(async (tx) => {
      // 4a. Buscar o crear el usuario
      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        // Si no existe, lo creamos con datos básicos (asumiendo que viene de un flujo de invitados)
        // Nota: En un sistema real, esto podría requerir más lógica de registro
        user = await tx.user.create({
          data: {
            email,
            username: email.split('@')[0] + "_" + Math.floor(Math.random() * 1000),
            password: "password_placeholder", // Debería manejarse mejor
            roleName: "User", // Asumiendo rol base
          }
        });
      }

      // 4b. Crear la cabecera de la Reservación
      const reservation = await tx.reservation.create({
        data: {
          user_id: user.id,
          status: BookingsStatus.PENDING,
          isRead: false,
        }
      });

      // 4c. Crear los detalles para cada habitación solicitada
      // Repartimos los huéspedes equitativamente o según capacidad (aquí lógica simple)
      const guestsPerRoom = Math.ceil(guests / rooms);

      const nights = calculateDuration(normArrivalDate, normDepartureDate);

      // Determinar temporada activa para la fecha de llegada
      const activeSeasonModel = await tx.season.findFirst({
        where: {
          dateStart: { lte: normArrivalDate },
          dateEnd: { gte: normArrivalDate },
        },
      });
      const activeSeasonName = activeSeasonModel ? activeSeasonModel.nameSeason : "BAJA";

      const detailsData = availableRooms.slice(0, rooms).map((room) => {
        const currentPrice = activeSeasonName === "ALTA" ? room.highSeasonPrice : room.lowSeasonPrice;
        const subtotalPerRoom = (currentPrice ?? 0) * (nights || 1);
        return {
          reservation_id: reservation.id,
          bedrooms_id: room.id,
          dateStart: normArrivalDate,
          dateEnd: normDepartureDate,
          status: Status.PENDING,
          price: subtotalPerRoom, // Guardamos el subtotal (Noches * Precio)
          guestQuantity: guestsPerRoom,
        };
      });

      await tx.reservationDetails.createMany({
        data: detailsData
      });

      return reservation;
    });

    revalidatePath("/dashboard/bookings");
    revalidatePath("/dashboard/bedrooms");

    return {
      success: true,
      message: "La reserva se registró correctamente.",
      data: result,
    };
  } catch (error) {
    console.error("Error al guardar la reserva:", error);
    return {
      success: false,
      message: "Error al guardar la reserva. Verifica que el tipo de habitación sea válido.",
    };
  }
};
