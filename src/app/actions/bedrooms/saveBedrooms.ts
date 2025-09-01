"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { promises as fs } from "fs";
import path from "path";

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "_")
    .replace(/^-+|-+$/g, "");
}

export const saveBedrooms = async (data: {
  typeBedroom: string;
  description: string;
  lowSeasonPrice: number;
  highSeasonPrice: number;
  numberBedroom: number;
  capacity: number;
  status: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  const {
    typeBedroom,
    description,
    lowSeasonPrice,
    highSeasonPrice,
    numberBedroom,
    capacity,
    status,
    image,
  } = data;

  const active = status === "1";

  const slug = generateSlug(typeBedroom);

  try {
    const existingBedroom = await prisma.bedrooms.findFirst({
      where: {
        numberBedroom: numberBedroom,
      },
    });

    if (existingBedroom) {
      console.log(
        `El número de habitación ${numberBedroom} ya está registrado.`
      );
      return {
        success: false,
        message: `El número de habitación ${numberBedroom} ya está registrado.`,
      };
    }

    const newBedroom = await prisma.bedrooms.create({
      data: {
        typeBedroom,
        description,
        lowSeasonPrice,
        highSeasonPrice,
        numberBedroom,
        capacity,
        status: active,
        image,
        slug,
        Seasons: {
          create: {
            nameSeason: "defaultSeason",
            dateStart: new Date(),
            dateEnd: new Date(),
          },
        },
      },
      include: {
        Seasons: true,
      },
    });

    revalidatePath("/bedrooms");

    return {
      success: true,
      message: "La habitación se registró correctamente.",
      data: newBedroom,
    };
  } catch (error) {
    console.error("Error al guardar la habitación:", error);
    return {
      success: false,
      message: "Error al guardar la habitación. Por favor intenta nuevamente.",
    };
  }
};

export const getBedrooms = async () => {
  try {
    const bedrooms = await prisma.bedrooms.findMany({
      include: {
        Seasons: true,
      },
      orderBy: {
        numberBedroom: "asc",
      },
    });

    return {
      success: true,
      data: bedrooms,
    };
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
    return {
      success: false,
      message: "Error al obtener las habitaciones.",
      data: [],
    };
  }
};

export const deleteBedroom = async (id: string) => {
  try {
    const bedroom = await prisma.bedrooms.findUnique({
      where: { id: Number(id) },
      select: {
        image: true,
      },
    });

    if (!bedroom) {
      return {
        success: false,
        message: "Habitación no encontrada.",
      };
    }

    await prisma.bedrooms.delete({
      where: { id: Number(id) },
    });

    // Opcional: Eliminar el archivo físico de imagen
    if (bedroom.image && bedroom.image.startsWith("/uploads/")) {
      try {
        const imagePath = path.join(process.cwd(), "public", bedroom.image);
        await fs.unlink(imagePath);
      } catch (fileError) {
        console.log("No se pudo eliminar el archivo de imagen:", fileError);
      }
    }

    revalidatePath("/bedrooms");

    return {
      success: true,
      message: "Habitación eliminada correctamente.",
    };
  } catch (error) {
    console.error("Error al eliminar habitación:", error);
    return {
      success: false,
      message: "Error al eliminar la habitación.",
    };
  }
};
