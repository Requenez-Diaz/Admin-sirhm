"use server";

import prisma from "@/lib/db";

export const getAllBedrooomToPromotions = async () => {
  try {
    const bedrooms = await prisma.bedrooms.findMany({
      include: {
        TypeBedrooms: true,
      },
    });
    return bedrooms;
  } catch (error) {
    console.error("Error al obtener las habitaciones", error);
    return [];
  }
};

// ("use server");

// export const getBedroomsT = async () => {
//   try {
//     const bedrooms = await prisma.bedrooms.findMany();
//     console.log("Habitaciones obtenidas", bedrooms);
//     return bedrooms;
//   } catch (error) {
//     console.error("Error al obtener las habitaciones", error);
//     return [];
//   }
// };
