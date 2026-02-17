"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "_")
    .replace(/^-+|-+$/g, "");
}

export type ActionState = { success: boolean; message: string; data?: any };

export async function saveBedroomsWithUpload(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const typeBedroomId = Number(formData.get("typeBedroomId"));
    const seasonsId = Number(formData.get("seasonsId"));
    const description = String(formData.get("description") || "").trim();
    const lowSeasonPrice = Number(formData.get("lowSeasonPrice"));
    const highSeasonPrice = Number(formData.get("highSeasonPrice"));
    const numberBedroom = Number(formData.get("numberBedroom"));
    const capacity = Number(formData.get("capacity"));
    const statusStr = String(formData.get("status") ?? "1");

    const imageUrl = String(formData.get("imageUrl") || "");
    const mimeType = String(formData.get("mimeType") || "");
    const fileName = String(formData.get("fileName") || "");

    // 3. Validaciones
    if (!typeBedroomId || !numberBedroom) {
      return {
        success: false,
        message: "Faltan datos requeridos (Tipo o Número de Habitación).",
      };
    }

    if (!seasonsId) {
      return {
        success: false,
        message: "Debes seleccionar una temporada.",
      };
    }

    if (
      [lowSeasonPrice, highSeasonPrice, numberBedroom, capacity].some((n) =>
        Number.isNaN(n),
      )
    ) {
      return { success: false, message: "Hay valores numéricos inválidos." };
    }

    if (!imageUrl) {
      return { success: false, message: "La imagen principal es requerida." };
    }

    const roomType = await prisma.typeBedrooms.findUnique({
      where: { id: typeBedroomId },
    });

    if (!roomType) {
      return { success: false, message: "El tipo de habitación no es válido." };
    }

    const exists = await prisma.bedrooms.findFirst({
      where: { numberBedroom },
    });
    if (exists) {
      return {
        success: false,
        message: `El número de habitación ${numberBedroom} ya está registrado.`,
      };
    }

    const active = statusStr === "1";
    const slug = generateSlug(`${roomType.nameType}_${numberBedroom}`);

    const galleryData =
      imageUrl && mimeType && fileName
        ? {
          create: [
            {
              imageContent: imageUrl,
              mimeType,
              fileName,
            },
          ],
        }
        : undefined;

    const created = await prisma.bedrooms.create({
      data: {
        description,
        lowSeasonPrice,
        highSeasonPrice,
        numberBedroom,
        capacity,
        status: active,
        image: imageUrl,
        slug,
        typeBedroomId,
        seasonsId,
        galleryImages: galleryData,
      },
      include: { galleryImages: true },
    });

    revalidatePath("/dashboard/bedrooms");
    revalidatePath("/");

    return {
      success: true,
      message: "La habitación se registró correctamente.",
      data: { id: created.id, numberBedroom: created.numberBedroom },
    };
  } catch (error) {
    console.error("Error al guardar la habitación:", error);
    return {
      success: false,
      message: "Error al guardar la habitación. Intenta nuevamente.",
    };
  }
}
