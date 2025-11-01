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
  formData: FormData
): Promise<ActionState> {
  try {
    const typeBedroom = String(formData.get("typeBedroom") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const lowSeasonPrice = Number(formData.get("lowSeasonPrice"));
    const highSeasonPrice = Number(formData.get("highSeasonPrice"));
    const numberBedroom = Number(formData.get("numberBedroom"));
    const capacity = Number(formData.get("capacity"));
    const statusStr = String(formData.get("status") ?? "1");

    const imageUrl = String(formData.get("imageUrl") || "");
    const mimeType = String(formData.get("mimeType") || "");
    const fileName = String(formData.get("fileName") || "");

    if (!typeBedroom || !numberBedroom) {
      return {
        success: false,
        message: "Faltan datos requeridos (Tipo o Número de Habitación).",
      };
    }

    if (
      [lowSeasonPrice, highSeasonPrice, numberBedroom, capacity].some((n) =>
        Number.isNaN(n)
      )
    ) {
      return { success: false, message: "Hay valores numéricos inválidos." };
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
    const slug = generateSlug(typeBedroom);

    const now = new Date();
    const nextYear = new Date(now);
    nextYear.setFullYear(now.getFullYear() + 1);

    const created = await prisma.bedrooms.create({
      data: {
        typeBedroom,
        description,
        lowSeasonPrice,
        highSeasonPrice,
        numberBedroom,
        capacity,
        status: active,
        image: imageUrl || "",
        slug,
        Seasons: {
          create: {
            nameSeason: "",
            dateStart: now,
            dateEnd: nextYear,
          },
        },
        galleryImages:
          imageUrl && mimeType && fileName
            ? {
                create: {
                  imageContent: imageUrl,
                  mimeType,
                  fileName,
                },
              }
            : undefined,
      },
      include: { galleryImages: true },
    });

    revalidatePath("/bedrooms");
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
