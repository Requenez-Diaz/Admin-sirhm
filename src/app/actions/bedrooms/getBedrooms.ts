"use server";

import prisma from "@/lib/db";

export const getBedrooms = async () => {
  try {
    const bedrooms = await prisma.bedrooms.findMany({
      include: {
        TypeBedrooms: true,
        Seasons: true,
        galleryImages: true,
        ReservationDetails: {
          where: {
            status: { not: "CANCELLED" },
          }
        }
      },
    });
    return bedrooms;
  } catch (error) {
    console.error("Error al obtener las habitaciones", error);
    return [];
  }
};