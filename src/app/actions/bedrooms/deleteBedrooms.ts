// src/app/actions/bedrooms/deleteBedrooms.ts
"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteBedrooms(formData: FormData) {
  const bedroomsId = String(formData.get("bedroomsId") ?? "");
  const id = Number(bedroomsId);

  if (!id || Number.isNaN(id)) {
    console.error("No se proporcionó un bedroomsId válido");
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1) Eliminar imágenes/metadatos asociados
      await tx.bedroomImages.deleteMany({ where: { bedroomId: id } });

      // (Opcional) elimina aquí otras dependencias si aplica a tu flujo:
      // await tx.comments.deleteMany({ where: { bedroomsId: id } });
      // await tx.testimonials.deleteMany({ where: { bedroomId: id } });
      // await tx.bookingsDetails.deleteMany({ where: { bedroomsId: id } });
      // await tx.bedroomsPromotions.deleteMany({ where: { bedroomId: id } });

      // 2) Eliminar la habitación
      await tx.bedrooms.delete({ where: { id } });

      // 3) Renumerar numberBedroom
      const bedrooms = await tx.bedrooms.findMany({
        orderBy: { numberBedroom: "asc" },
        select: { id: true },
      });

      for (let i = 0; i < bedrooms.length; i++) {
        await tx.bedrooms.update({
          where: { id: bedrooms[i].id },
          data: { numberBedroom: i + 1 },
        });
      }
    });

    revalidatePath("/bedrooms");
  } catch (error) {
    console.error("Error al eliminar la habitación: ", error);
  }
}
