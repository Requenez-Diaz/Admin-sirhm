"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const saveBedrooms = async (formData: FormData) => {
  const typeBedroom = formData.get("typeBedroom") as string;
  const description = formData.get("description") as string;
  const lowSeasonPrice = Number(formData.get("lowSeasonPrice"));
  const highSeasonPrice = Number(formData.get("highSeasonPrice"));
  const numberBedroom = Number(formData.get("numberBedroom"));
  const seasons = formData.get("seasons") as string;
  const active = formData.get("status") === "1";

  try {
    const newBedroom = await prisma.bedrooms.create({
      data: {
        typeBedroom,
        description,
        lowSeasonPrice,
        highSeasonPrice,
        numberBedroom,
        status: active,
        seasons: {
          create: {
            nameSeason: seasons,
            dateStart: new Date(),
            dateEnd: new Date(),
          },
        },
      },
    });

    console.log("Habitación guardada con éxito", newBedroom);
    return { message: "Success" };
  } catch (error) {
    console.error("Error al guardar la habitación", error);
    return { message: "Error al guardar la habitación" };
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

export const getBedroomsById = async (id: Number) => {
  try {
    const bedrooms = await prisma.bedrooms.findUnique({
      where: { id: Number(id) },
    });
    return bedrooms;
  } catch (error) {
    throw new Error("Error al obtener la habitacion");
  }
};

export const updateBedrooms = async (formData: FormData) => {
  const data = {
    typeBedroom: formData.get("typeBedroom") as string,
    description: formData.get("description") as string,
    lowSeasonPrice: Number(formData.get("lowSeasonPrice")),
    numberBedroom: Number(formData.get("numberBedroom")),
    status: formData.get("status") as "0" | "1",
  };

  //   const validateFields = BedroomsSchema.safeParse(data);

  //   if (!validateFields.success) {
  //     console.log(
  //       'Validation failed',
  //       validateFields.error.flatten().fieldErrors
  //     );
  //     return {
  //       Error: validateFields.error.flatten().fieldErrors
  //     };
  //   }

  try {
    // console.log(
    //   'Updating bedroom with id',
    //   id,
    //   'and data',
    //   validateFields.data
    // );
    // await prisma.bedrooms.update({
    //   data: {
    //     typeBedroom: validateFields.data.typeBedroom,
    //     description: validateFields.data.description,
    //     lowSeasonPrice: validateFields.data.lowSeasonPrice,
    //     numberBedroom: validateFields.data.numberBedroom,
    //     status: validateFields.data.status === '1'
    //   },
    //   where: { id: Number(id) }
    // });
    // console.log('Update successful');
  } catch (error) {
    return {
      message: "Error al actualizar la habitacion",
    };
  }

  revalidatePath("/bedrooms");
  redirect("/bedrooms");
};

export const deleteBedrooms = async (id: Number) => {
  try {
    await prisma.bedrooms.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/bedrooms");
    redirect("/bedrooms");
  } catch (error) {
    return { message: "Error al eliminar la habitacion" };
  }
};
