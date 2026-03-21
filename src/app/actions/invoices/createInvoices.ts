"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: {
  clientId: number;
  items: any[];
  reservationId?: number;
}) {
  try {
    const newInvoice = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          clientId: data.clientId,
          date: new Date(),
          reservationId: data.reservationId,
          invoceDetail: {
            create: data.items.map((i) => ({
              item: i.item,
              price: Math.round(i.price),
              amount: i.amount,
            })),
          },
        } as any,
      });
      return invoice;
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/bookings");

    return { success: true, id: newInvoice.id };
  } catch (error) {
    console.error("Error guardando factura:", error);
    return { success: false, error: "Error de base de datos" };
  }
}
