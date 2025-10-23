"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type PromotionData = {
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: Date;
  dateEnd: Date;
  description?: string;
  seasonId: number;
  bedroomIds: number[]; // Updated to accept multiple bedroom IDs
};

// Crear una nueva promoción
export async function createPromotion(data: PromotionData) {
  try {
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

    // Verificar que las habitaciones existen
    const bedrooms = await prisma.bedrooms.findMany({
      where: { id: { in: data.bedroomIds } },
    });

    if (bedrooms.length !== data.bedroomIds.length) {
      return {
        success: false,
        error: "Una o más habitaciones seleccionadas no existen",
      };
    }

    // Verificar si ya existe una promoción activa para estas habitaciones específicas
    for (const bedroomId of data.bedroomIds) {
      const existingBedroomPromotion =
        await prisma.bedroomsPromotions.findFirst({
          where: {
            bedroomId: bedroomId,
            promotion: {
              dateStart: { lte: data.dateEnd },
              dateEnd: { gte: data.dateStart },
            },
          },
          include: {
            promotion: true,
          },
        });

      if (existingBedroomPromotion) {
        return {
          success: false,
          error: `Ya existe una promoción activa para la habitación ${existingBedroomPromotion.bedroomId} (${existingBedroomPromotion.promotion.codePromotions})`,
        };
      }
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

    await prisma.bedroomsPromotions.createMany({
      data: data.bedroomIds.map((bedroomId) => ({
        promotionId: promotion.id,
        bedroomId: bedroomId,
      })),
    });

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
    if (!data.bedroomIds || data.bedroomIds.length === 0) {
      return {
        success: false,
        error: "Debes seleccionar al menos una habitación",
      };
    }

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

    const bedrooms = await prisma.bedrooms.findMany({
      where: { id: { in: data.bedroomIds } },
    });

    if (bedrooms.length !== data.bedroomIds.length) {
      return {
        success: false,
        error: "Una o más habitaciones seleccionadas no existen",
      };
    }

    for (const bedroomId of data.bedroomIds) {
      const existingBedroomPromotion =
        await prisma.bedroomsPromotions.findFirst({
          where: {
            bedroomId: bedroomId,
            promotionId: { not: id },
            promotion: {
              dateStart: { lte: data.dateEnd },
              dateEnd: { gte: data.dateStart },
            },
          },
          include: {
            promotion: true,
            bedroom: true,
          },
        });

      if (existingBedroomPromotion) {
        return {
          success: false,
          error: `Ya existe una promoción activa para la habitación ${existingBedroomPromotion.bedroom.typeBedroom} (${existingBedroomPromotion.promotion.codePromotions})`,
        };
      }
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

    await prisma.bedroomsPromotions.deleteMany({
      where: { promotionId: id },
    });

    await prisma.bedroomsPromotions.createMany({
      data: data.bedroomIds.map((bedroomId) => ({
        promotionId: id,
        bedroomId: bedroomId,
      })),
    });

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

    // Eliminar relación con habitación
    await prisma.bedroomsPromotions.deleteMany({
      where: { promotionId: id },
    });

    // Eliminar la promoción
    await prisma.promotions.delete({
      where: { id },
    });

    revalidatePath("/dashboard/offerts");

    return { success: true, message: "Promoción eliminada correctamente" };
  } catch (error) {
    console.error("Error al eliminar promoción:", error);
    return { success: false, error: "Error al eliminar promoción" };
  }
}

// Obtener habitaciones disponibles para promociones
export async function getAvailableBedrooms() {
  try {
    const bedrooms = await prisma.bedrooms.findMany({
      select: {
        id: true,
        typeBedroom: true,
        numberBedroom: true,
      },
      orderBy: {
        numberBedroom: "asc",
      },
    });

    return { success: true, data: bedrooms };
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    return { success: false, error: "Error al obtener habitaciones" };
  }
}

// Verificar si una habitación específica tiene promociones activas
export async function checkBedroomPromotions(bedroomId: number) {
  try {
    const activePromotions = await prisma.bedroomsPromotions.findMany({
      where: {
        bedroomId: bedroomId,
        promotion: {
          dateStart: { lte: new Date() },
          dateEnd: { gte: new Date() },
        },
      },
      include: {
        promotion: {
          include: {
            seasons: true,
          },
        },
        bedroom: true,
      },
    });

    return { success: true, data: activePromotions };
  } catch (error) {
    console.error("Error al verificar promociones de habitación:", error);
    return { success: false, error: "Error al verificar promociones" };
  }
}
