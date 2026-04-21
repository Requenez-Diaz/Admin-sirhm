import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { InvoiceActions } from "./components/deleteInvoices";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: { invoceDetail: true },
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

      {/* Contenedor Adaptativo */}
      <div className='border rounded-xl bg-card overflow-x-auto relative shadow-sm'>
        <table className='w-full text-left text-sm min-w-full'>
          <thead className='bg-muted/50 border-b'>
            <tr className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
              <th className='p-4 whitespace-nowrap'>Referencia</th>
              <th className='p-4 whitespace-nowrap'>Cliente ID</th>
              <th className='p-4 whitespace-nowrap'>Fecha</th>
              <th className='p-4 whitespace-nowrap'>Total</th>
              {/* Encabezado Fijo */}
              <th className='p-4 text-right sticky right-0 z-20 bg-muted/95 backdrop-blur-sm shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {invoices.map((inv) => {
              const total = inv.invoceDetail.reduce(
                (acc, item) => acc + item.price * item.amount,
                0,
              );

              return (
                <tr
                  key={inv.id}
                  className='hover:bg-muted/30 transition-colors group'
                >
                  <td className='p-4 whitespace-nowrap'>
                    <Badge variant='outline' className='font-mono'>
                      #INV-{inv.id.toString().padStart(5, "0")}
                    </Badge>
                  </td>
                  <td className='p-4 font-medium whitespace-nowrap'>
                    Cliente #{inv.clientId}
                  </td>
                  <td className='p-4 text-muted-foreground whitespace-nowrap'>
                    {inv.date.toLocaleDateString("es-NI", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className='p-4 font-bold text-primary whitespace-nowrap'>
                    C$ {total.toLocaleString()}
                  </td>

                  <td className='p-4 sticky right-0 z-10 bg-background/95 backdrop-blur-sm text-right shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:bg-muted/50 transition-colors'>
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
