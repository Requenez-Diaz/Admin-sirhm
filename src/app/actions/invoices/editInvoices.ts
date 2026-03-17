"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateInvoice(
  id: number,
  data: { clientId: number; items: any[] },
) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizamos el cliente o la fecha de la factura principal
      await tx.invoice.update({
        where: { id },
        data: {
          clientId: data.clientId,
          // No actualizamos la fecha para mantener el registro histórico original
        },
      });

      // 2. Eliminamos los detalles anteriores para evitar duplicidad o conflictos
      await tx.invoceDetail.deleteMany({
        where: { invoceId: id },
      });

      // 3. Insertamos los nuevos detalles editados
      await tx.invoceDetail.createMany({
        data: data.items.map((i) => ({
          invoceId: id,
          item: i.item,
          price: Math.round(i.price),
          amount: i.amount,
        })),
      });
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${id}`);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Error al actualizar la factura" };
  }
}
