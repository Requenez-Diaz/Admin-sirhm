"use server";

import prisma from "@/lib/db";
import { bedrooms } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const saveBedrooms = async (formData: FormData) => {
  const typeBedroom = formData.get("typeBedroom") as string;
  const description = formData.get("description") as string;
  const lowSeasonPrice = Number(formData.get("lowSeasonPrice"));
  const highSeasonPrice = Number(formData.get("highSeasonPrice"));
  const numberBedroom = Number(formData.get("numberBedroom"));
  const seasons = formData.get("seasons") as string;
  const active = formData.get("status") === "1";

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
        typeBedroom: typeBedroom ?? "",
        description: description ?? "",
        lowSeasonPrice: lowSeasonPrice,
        highSeasonPrice: highSeasonPrice,
        numberBedroom: numberBedroom,
        status: active,
        Seasons: {
          create: {
            nameSeason: seasons ?? "",
            dateStart: new Date(),
            dateEnd: new Date(),
          },
        },
      },
    });
    revalidatePath("/bedrooms");

    console.log("Habitación guardada con éxito", newBedroom);
    return {
      success: true,
      message: "La habitación se registró correctamente.",
    };
  } catch (error) {
    console.error("Error al guardar la habitación", error);
    return { success: false, message: "Error al guardar la habitación" };
  }
};

export const getBedrooms = async () => {
  try {
    const bedrooms = await prisma.bedrooms.findMany();
    return bedrooms;
  } catch (error) {
    console.error("Error al obtener las habitaciones", error);
    return [];
  }
};

export const getBedroomsById = async (id: number): Promise<bedrooms | null> => {
  try {
    const bedroom = await prisma.bedrooms.findUnique({
      where: { id: Number(id) },
    });
    return bedroom;
  } catch (error) {
    console.error("Error al obtener la habitación", error);
    return null;
  }
};

export async function updateBedroom(formData: FormData) {
  const bedroomsId = formData.get("bedroomsId")?.toString();
  const typeBedroom = formData.get("typeBedroom")?.toString();
  const description = formData.get("description")?.toString();
  const lowSeasonPrice = formData.get("lowSeasonPrice")?.toString();
  const highSeasonPrice = formData.get("highSeasonPrice")?.toString();
  const status = formData.get("status")?.toString();
  const numberBedroom = formData.get("numberBedroom")?.toString();

  if (!bedroomsId) {
    console.error("No se proporcionó bedroomsId");
    return;
  }

  try {
    await prisma.bedrooms.update({
      where: {
        id: parseInt(bedroomsId),
      },
      data: {
        typeBedroom,
        description,
        lowSeasonPrice: parseFloat(lowSeasonPrice || "0"),
        highSeasonPrice: parseFloat(highSeasonPrice || "0"),
        status: status === "1",
        numberBedroom: parseInt(numberBedroom || "0"),
      },
    });
    revalidatePath("/bedrooms");
  } catch (error) {
    console.error("Error al actualizar la habitación: ", error);
  }
}

export async function deleteBedrooms(formData: FormData) {
  const bedroomsId = formData.get("bedroomsId")?.toString();
  if (!bedroomsId) {
    console.error("No se proporcionó bedroomsId");
    return;
  }
  try {
    await prisma.bedrooms.delete({
      where: {
        id: parseInt(bedroomsId),
      },
    });

    const bedrooms = await prisma.bedrooms.findMany({
      orderBy: {
        numberBedroom: "asc",
      },
    });

    for (let i = 0; i < bedrooms.length; i++) {
      const currentNumber = i + 1;
      await prisma.bedrooms.update({
        where: {
          id: bedrooms[i].id,
        },
        data: {
          numberBedroom: currentNumber,
        },
      });
    }

    revalidatePath("/bedrooms");
  } catch (error) {
    console.error("Error al eliminar la habitación: ", error);
  }
}
