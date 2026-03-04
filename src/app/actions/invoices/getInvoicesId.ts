"use server";

import prisma from "@/lib/db";

export async function getFullInvoiceDetail(id: string) {
  try {
    const invoiceId = parseInt(id);

    const invoice = await prisma.invoce.findUnique({
      where: { id: invoiceId },
      include: { invoceDetails: true },
    });

    if (!invoice) return { success: false, error: "Factura no encontrada" };

    const user = await prisma.user.findUnique({
      where: { id: invoice.clientId },
      select: {
        username: true,
        email: true,
        roleName: true,
        image: true,
      },
    });

    const lastReservation = await prisma.reservation.findFirst({
      where: { user_id: invoice.clientId },
      orderBy: { createdAt: "desc" },
      include: {
        ReservationDetails: {
          include: { Bedrooms: true },
        },
      },
    });

    const total = invoice.invoceDetails.reduce(
      (acc, item) => acc + item.price * item.amount,
      0,
    );

    return {
      success: true,
      data: {
        ...invoice,
        client: user,
        reservation: lastReservation,
        total,
      },
    };
  } catch (error) {
    return { success: false, error: "Error al recuperar detalles" };
  }
}
