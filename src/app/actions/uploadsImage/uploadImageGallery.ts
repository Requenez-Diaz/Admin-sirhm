"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export type ActionState = { success: boolean; message: string; data?: any };

export async function uploadGalleryImage(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const bedroomId = Number(formData.get("bedroomId"));
    const imageUrl = String(formData.get("imageUrl") || "");
    const mimeType = String(formData.get("mimeType") || "");
    const fileName = String(formData.get("fileName") || "");

    // Validate required fields
    if (!bedroomId || !imageUrl) {
      return {
        success: false,
        message: "Los datos de la habitación y la imagen son obligatorios.",
      };
    }

    if (Number.isNaN(bedroomId)) {
      return {
        success: false,
        message: "El ID de la habitación es inválido.",
      };
    }

    // Create the gallery image record
    const newImage = await prisma.bedroomImages.create({
      data: {
        bedroomId,
        imageContent: imageUrl,
        mimeType,
        fileName,
      },
    });

    revalidatePath("/bedrooms");
    revalidatePath("/");

    return {
      success: true,
      message: "Imagen de galería guardada con éxito.",
      data: newImage,
    };
  } catch (error) {
    console.error("Error al guardar imagen de galería:", error);
    return {
      success: false,
      message: "Error al guardar la imagen. Intenta nuevamente.",
    };
  }
}
