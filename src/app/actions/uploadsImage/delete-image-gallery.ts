// app/actions/uploadsImage/uploadImageGallery.ts (uso server)
"use server";

import prisma from "@/lib/db";

export const deleteImageFromGallery = async (
  bedroomsId: number,
  imageUrl: string,
  mimeType: string,
  fileName: string
) => {
  try {
    // ...
    const newImage = await prisma.bedroomImages.create({
      data: {
        bedroomId: bedroomsId,
        imageContent: imageUrl,
        mimeType: mimeType,
        fileName: fileName,
      },
    });

    return {
      success: true,
      message: "Imagen de galería guardada con éxito.",
      data: newImage,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al guardar la imagen. Intenta nuevamente.",
    };
  }
};
