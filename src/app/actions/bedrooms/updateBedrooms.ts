"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const updateBedroom = async (data: {
  bedroomsId: string;
  typeBedroomId: number;
  description: string;
  lowSeasonPrice: number;
  highSeasonPrice: number;
  numberBedroom: number;
  capacity: number;
  status: string;
  seasonsId: number | null;
  imageUrl?: string;
  mimeType?: string;
  fileName?: string;
}) => {
  const {
    bedroomsId,
    typeBedroomId,
    description,
    lowSeasonPrice,
    highSeasonPrice,
    numberBedroom,
    capacity,
    status,
    seasonsId,
    imageUrl,
    mimeType,
    fileName,
  } = data;

  const active = status === "1";

  try {
    const updateData: any = {
      description,
      lowSeasonPrice,
      highSeasonPrice,
      numberBedroom,
      capacity,
      status: active,
      typeBedroomId,
      seasonsId,
    };

    if (imageUrl) {
      updateData.image = imageUrl;
      if (mimeType && fileName) {
        updateData.galleryImages = {
          create: [
            {
              imageContent: imageUrl,
              mimeType,
              fileName,
            },
          ],
        };
      }
    }

    await prisma.bedroom.update({
      where: {
        id: parseInt(bedroomsId),
      },
      data: updateData,
    });

    revalidatePath("/dashboard/bedrooms");
    revalidatePath("/");

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
