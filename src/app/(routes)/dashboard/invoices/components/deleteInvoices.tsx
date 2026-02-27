"use client";

import { deleteInvoice } from "@/app/actions/invoices/deleteInvoices";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function InvoiceActions({ invoiceId }: { invoiceId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    setIsDeleting(true);
    const res = await deleteInvoice(invoiceId);

    if (res.success) {
      toast.success("Factura eliminada correctamente");
    } else {
      toast.error("Error al intentar eliminar la factura");
      setIsDeleting(false);
    }
  };

  return (
    <div className='flex justify-end gap-2'>
      <Button variant='ghost' size='sm' asChild title='Ver Detalle'>
        <Link href={`/dashboard/invoices/${invoiceId}`}>
          <Eye className='h-4 w-4 text-blue-500' />
        </Link>
      </Button>

      <Button variant='ghost' size='sm' asChild title='Editar'>
        <Link href={`/dashboard/invoices/edit/${invoiceId}`}>
          <Edit className='h-4 w-4 text-orange-500' />
        </Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            disabled={isDeleting}
            title='Eliminar'
          >
            {isDeleting ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Trash2 className='h-4 w-4 text-red-500' />
            )}
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className='border-border bg-card'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-xl font-bold'>
              ¿Confirmar eliminación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la factura
              <strong className='text-foreground'> #INV-{invoiceId} </strong>y
              todos sus detalles de la base de datos de SIRHM.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className='border-muted-foreground/20'>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className='bg-red-600 hover:bg-red-700 text-white font-bold'
            >
              {isDeleting ? "Eliminando..." : "Sí, eliminar factura"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
