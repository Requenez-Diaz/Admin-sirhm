"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: { clientId: number; items: any[] }) {
  try {
    const newInvoice = await prisma.$transaction(async (tx) => {
      // Creamos la factura en la tabla 'Invoce'
      const invoice = await tx.invoice.create({
        data: {
          clientId: data.clientId,
          date: new Date(),
          invoceDetails: {
            create: data.items.map((i) => ({
              item: i.item,
              price: Math.round(i.price),
              amount: i.amount,
            })),
          },
        },
      });
      return invoice;
    });

    revalidatePath("/dashboard/invoices");

    return { success: true, id: newInvoice.id };
  } catch (error) {
    console.error("Error guardando factura:", error);
    return { success: false, error: "Error de base de datos" };
  }
}
