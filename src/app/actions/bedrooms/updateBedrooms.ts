"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateBedroom = async (data: {
  bedroomsId: string;
  typeBedroom: string;
  description: string;
  lowSeasonPrice: number;
  highSeasonPrice: number;
  numberBedroom: number;
  capacity: number;
  status: string;
  seasonsId: number; // Agregado para coincidir con el formulario
}) => {
  const {
    bedroomsId,
    typeBedroom,
    description,
    lowSeasonPrice,
    highSeasonPrice,
    numberBedroom,
    capacity,
    status,
    seasonsId,
  } = data;

  const active = status === "1";

  try {
    // Usamos el update directamente. Si no existe, caerá al catch.
    await prisma.bedrooms.update({
      where: {
        id: parseInt(bedroomsId),
      },
      data: {
        typeBedroom,
        description,
        lowSeasonPrice,
        highSeasonPrice,
        numberBedroom,
        capacity,
        status: active,
        Seasons: {
          connect: { id: seasonsId },
        },
      },
    });

    revalidatePath("/bedrooms");

    return {
      success: true,
      message: "La habitación y su temporada se actualizaron correctamente.",
    };
  } catch (error) {
    console.error("Update Error:", error);
    return {
      success: false,
      message: "Error al actualizar la habitación. Verifique los datos.",
    };
  }
};
