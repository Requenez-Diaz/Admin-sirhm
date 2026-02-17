"use client";

import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Verifica si es /hooks/use-toast en tu versión
import { deleteTypeBedroom } from "@/app/actions/roomsType/rooms-type";
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

export function DeleteTypeButton({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteTypeBedroom(id);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Registro eliminado",
        description: "La categoría se borró correctamente.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "No se pudo eliminar",
        description: result.error,
      });
    }
  };

  return (
    <AlertDialog>
      {/* El disparador es el botón de la basura */}
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive'
          disabled={loading}
        >
          <Trash2 className='w-4 h-4' />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className='flex items-center gap-3 text-destructive mb-2'>
            <AlertTriangle className='w-6 h-6' />
            <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente la
            categoría seleccionada. Si existen habitaciones que dependen de este
            tipo, la acción será cancelada por seguridad.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin mr-2' />
            ) : (
              "Confirmar Eliminación"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
