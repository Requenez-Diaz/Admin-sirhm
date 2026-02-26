import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import prisma from "@/lib/db";

export default async function InvoicesPage() {
  const invoices = await prisma.invoce.findMany({
    include: { invoceDetails: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Listado de Facturas</h1>
        <Button
          asChild
          className={
            "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:text-white"
          }
        >
          <Link href='/dashboard/invoices/new'>
            <Plus className='mr-2 h-4 w-4' /> Nueva Factura
          </Link>
        </Button>
      </div>

      <div className='border rounded-lg overflow-hidden'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-muted'>
            <tr>
              <th className='p-4'>ID</th>
              <th className='p-4'>Cliente ID</th>
              <th className='p-4'>Fecha</th>
              <th className='p-4 text-right'>Acciones</th>
            </tr>
          </thead>
          <tbody className='divide-y'>
            {invoices.map((inv) => (
              <tr key={inv.id} className='hover:bg-muted/50'>
                <td className='p-4 font-mono'>#{inv.id}</td>
                <td className='p-4'>{inv.clientId}</td>
                <td className='p-4'>{inv.date.toLocaleDateString()}</td>
                <td className='p-4 text-right'>
                  <Button variant='ghost' size='sm' asChild>
                    <Link href={`/dashboard/invoices/${inv.id}`}>
                      <Eye className='h-4 w-4 mr-2' /> Ver Detalle
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
