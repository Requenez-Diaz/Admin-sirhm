"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(id: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Borrar detalles primero
      await tx.invoceDetails.deleteMany({
        where: { invoceId: id },
      });
      // 2. Borrar la factura
      await tx.invoce.delete({
        where: { id },
      });
    });

    revalidatePath("/dashboard/invoices");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo eliminar la factura" };
  }
}
