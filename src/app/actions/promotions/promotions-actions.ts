"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

// Tipo para los datos de la promoción
type PromotionData = {
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: Date;
  dateEnd: Date;
  description?: string;
  seasonId: number;
  bedroomIds: number[];
};

// Crear una nueva promoción
export async function createPromotion(data: PromotionData) {
  try {
    // Verificar si ya existe una promoción con el mismo código
    const existingPromotion = await prisma.promotions.findFirst({
      where: {
        codePromotions: data.codePromotions,
      },
    });

    if (existingPromotion) {
      return {
        success: false,
        error: "Ya existe una promoción con este código",
      };
    }

    // Crear la promoción
    const promotion = await prisma.promotions.create({
      data: {
        codePromotions: data.codePromotions,
        porcentageDescuent: data.porcentageDescuent,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        description: data.description ?? "",
        seasonId: data.seasonId,
      },
    });

    // Crear las relaciones con las habitaciones
    if (data.bedroomIds && data.bedroomIds.length > 0) {
      const BedroomsPromotions = data.bedroomIds.map((bedroomId) => ({
        promotionId: promotion.id,
        bedroomId,
      }));

      await prisma.bedroomsPromotions.createMany({
        data: BedroomsPromotions,
      });
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/offerts");

    return { success: true, data: promotion };
  } catch (error) {
    console.error("Error al crear promoción:", error);
    return { success: false, error: "Error al crear promoción" };
  }
}

// Obtener todas las promociones
export async function getPromotions() {
  try {
    const promotions = await prisma.promotions.findMany({
      include: {
        seasons: true,
        BedroomsPromotions: {
          include: {
            bedroom: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: promotions };
  } catch (error) {
    console.error("Error al obtener promociones:", error);
    return { success: false, error: "Error al obtener promociones" };
  }
}

// Obtener una promoción específica
export async function getPromotion(id: number) {
  try {
    const promotion = await prisma.promotions.findUnique({
      where: { id },
      include: {
        seasons: true,
        BedroomsPromotions: {
          include: {
            bedroom: true,
          },
        },
      },
    });

    if (!promotion) {
      return { success: false, error: "Promoción no encontrada" };
    }

    return { success: true, data: promotion };
  } catch (error) {
    console.error("Error al obtener promoción:", error);
    return { success: false, error: "Error al obtener promoción" };
  }
}

// Actualizar una promoción
export async function updatePromotion(id: number, data: PromotionData) {
  try {
    // Verificar si la promoción existe
    const existingPromotion = await prisma.promotions.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      return { success: false, error: "Promoción no encontrada" };
    }

    // Verificar si ya existe otra promoción con el mismo código (excepto la actual)
    const duplicateCode = await prisma.promotions.findFirst({
      where: {
        codePromotions: data.codePromotions,
        id: { not: id },
      },
    });

    if (duplicateCode) {
      return {
        success: false,
        error: "Ya existe otra promoción con este código",
      };
    }

    // Actualizar la promoción
    const updatedPromotion = await prisma.promotions.update({
      where: { id },
      data: {
        codePromotions: data.codePromotions,
        porcentageDescuent: data.porcentageDescuent,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        description: data.description,
        seasonId: data.seasonId,
      },
    });

    // Eliminar relaciones existentes
    await prisma.bedroomsPromotions.deleteMany({
      where: { promotionId: id },
    });

    // Crear nuevas relaciones con las habitaciones
    if (data.bedroomIds && data.bedroomIds.length > 0) {
      const BedroomsPromotions = data.bedroomIds.map((bedroomId) => ({
        promotionId: id,
        bedroomId,
      }));

      await prisma.bedroomsPromotions.createMany({
        data: BedroomsPromotions,
      });
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/offerts");

    return { success: true, data: updatedPromotion };
  } catch (error) {
    console.error("Error al actualizar promoción:", error);
    return { success: false, error: "Error al actualizar promoción" };
  }
}

// Eliminar una promoción
export async function deletePromotion(id: number) {
  try {
    // Verificar si la promoción existe
    const existingPromotion = await prisma.promotions.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      return { success: false, error: "Promoción no encontrada" };
    }

    // Eliminar relaciones con habitaciones
    await prisma.bedroomsPromotions.deleteMany({
      where: { promotionId: id },
    });

    // Eliminar la promoción
    await prisma.promotions.delete({
      where: { id },
    });

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/dashboard/offerts");

    return { success: true, message: "Promoción eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar promoción:", error);
    return { success: false, error: "Error al eliminar promoción" };
  }
}
