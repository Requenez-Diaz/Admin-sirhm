"use server";

import prisma from "@/lib/db";

export const uploadGalleryImage = async (
  _prevState: unknown,
  formData: FormData
) => {
  try {
    const bedroomId = parseInt(formData.get("bedroomId") as string);
    const imageUrl = formData.get("imageUrl") as string;
    const mimeType = formData.get("mimeType") as string;
    const fileName = formData.get("fileName") as string;

    if (!bedroomId || !imageUrl || !mimeType || !fileName) {
      return {
        success: false,
        message: "Faltan datos requeridos.",
      };
    }

    const newGalleryImage = await prisma.bedroomImages.create({
      data: {
        bedroomId: bedroomId,
        imageContent: imageUrl,
        fileName: fileName,
        mimeType: mimeType,
      },
    });

    return {
      success: true,
      message: "Imagen de galería subida exitosamente.",
      data: {
        id: newGalleryImage.id,
        imageContent: newGalleryImage.imageContent,
      },
    };
  } catch (error) {
    console.error("Error uploading gallery image:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error al subir imagen.",
    };
  }
};
