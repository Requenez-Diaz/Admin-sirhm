import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import EditInvoiceForm from "../../components/EditInvoiceForm";

interface PageProps {
  params: Promise<{ edit: string }>;
}

export default async function EditInvoicePage({ params }: PageProps) {
  const resolvedParams = await params;

  const id = parseInt(resolvedParams.edit);

  if (isNaN(id)) {
    return notFound();
  }

  const invoice = await prisma.invoce.findUnique({
    where: { id: id },
    include: { invoceDetails: true },
  });

  if (!invoice) notFound();

  return (
    <div className='p-4 md:p-8 max-w-3xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-3xl font-black uppercase tracking-tight text-primary'>
          Editar Factura
        </h1>
        <p className='text-muted-foreground font-medium'>
          Modificando registro oficial #INV-{id}
        </p>
      </div>

      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}
