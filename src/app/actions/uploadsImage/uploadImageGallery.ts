"use server";

import prisma from "@/lib/db";

export const uploadGalleryImage = async (
  bedroomsId: number,
  imageBase64: string
) => {
  try {
    if (!bedroomsId || !imageBase64) {
      return {
        success: false,
        error: "Los datos de la habitación y la imagen son obligatorios.",
      };
    }

    const newImage = await prisma.bedroomImages.create({
      data: {
        bedroomId: bedroomsId,
        imageContent: imageBase64,
      },
    });

    return {
      success: true,
      message: "Imagen de galería guardada con éxito.",
      data: newImage,
    };
  } catch (error) {
    console.error("Error al guardar la imagen de galería:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al guardar la imagen.",
    };
  }
};
