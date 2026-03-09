import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { InvoiceActions } from "./components/deleteInvoices";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { invoceDetails: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className='p-4 md:p-8 space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-black tracking-tight flex items-center gap-2'>
            <Receipt className='text-blue-600 h-8 w-8' />
            FACTURACIÓN
          </h1>
          <p className='text-muted-foreground text-sm'>
            Gestiona y consulta los registros de Hotelito Madroño.
          </p>
        </div>

        <Button asChild variant={"success"}>
          <Link href='/dashboard/invoices/new'>
            <Plus className='mr-2 h-4 w-4' /> Nueva Factura
          </Link>
        </Button>
      </div>

      <div className='border rounded-xl bg-card overflow-hidden shadow-sm'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-muted/50 border-b'>
            <tr className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              <th className='p-4'>Referencia</th>
              <th className='p-4'>Cliente ID</th>
              <th className='p-4'>Fecha</th>
              <th className='p-4'>Total</th>
              <th className='p-4 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {invoices.map((inv) => {
              const total = inv.invoceDetails.reduce(
                (acc, item) => acc + item.price * item.amount,
                0,
              );

              return (
                <tr
                  key={inv.id}
                  className='hover:bg-muted/30 transition-colors group'
                >
                  <td className='p-4'>
                    <Badge variant='outline' className='font-mono'>
                      #INV-{inv.id.toString().padStart(5, "0")}
                    </Badge>
                  </td>
                  <td className='p-4 font-medium'>Cliente #{inv.clientId}</td>
                  <td className='p-4 text-muted-foreground'>
                    {inv.date.toLocaleDateString("es-NI", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className='p-4 font-bold text-primary'>
                    C$ {total.toLocaleString()}
                  </td>
                  <td className='p-4'>
                    <InvoiceActions invoiceId={inv.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className='p-20 text-center text-muted-foreground italic'>
            No hay facturas registradas en el sistema.
          </div>
        )}
      </div>
    </div>
  );
}
