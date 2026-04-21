"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  updateTypeBedroom,
  deleteTypeBedroom,
} from "@/app/actions/roomsType/rooms-type";

interface TypeBedroom {
  id: number;
  nameType: string;
  description: string;
  _count?: { Bedrooms: number };
}

export function TableTypeRow({ type }: { type: TypeBedroom }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [editName, setEditName] = useState(type.nameType);
  const [editDesc, setEditDesc] = useState(type.description);

  const handleEdit = async () => {
    setLoading(true);
    const result = await updateTypeBedroom(type.id, {
      nameType: editName,
      description: editDesc,
    });
    setLoading(false);

    if (result.success) {
      toast({
        title: "Actualizado",
        description: "La categoría se actualizó con éxito.",
      });
      setEditOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteTypeBedroom(type.id);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Eliminado",
        description: "La categoría se borró correctamente.",
      });
      setDeleteOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  return (
    <>
      <tr className='hover:bg-muted/30 transition-colors text-sm group'>
        <td className='px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap'>
          #{type.id}
        </td>
        <td className='px-6 py-4 font-bold text-foreground whitespace-nowrap'>
          {type.nameType}
        </td>
        <td className='px-6 py-4 text-muted-foreground max-w-xs truncate whitespace-nowrap'>
          {type.description}
        </td>
        <td className='px-6 py-4 text-center whitespace-nowrap'>
          <span className='px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black border border-primary/20 whitespace-nowrap'>
            {type._count?.Bedrooms || 0} HABs
          </span>
        </td>

        {/* COLUMNA DE ACCIONES PEGAJOSA (STICKY) */}
        <td className='px-6 py-4 text-right sticky right-0 z-10 bg-background/95 backdrop-blur-sm shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:bg-muted/50 transition-colors'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-muted'>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className='mr-2 h-4 w-4' /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className='text-red-600 focus:text-red-600'
              >
                <Trash2 className='mr-2 h-4 w-4' /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      {/* Modales de Edición y Eliminación (Sin cambios en lógica) */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='uppercase font-black text-blue-600'>
              Editar Categoría
            </DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase text-muted-foreground'>
                Nombre
              </label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-xs font-bold uppercase text-muted-foreground'>
                Descripción
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className='flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEdit}
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{" "}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la categoría{" "}
              <strong className='text-foreground'>{type.nameType}</strong>. No
              podrás deshacer esta operación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className='bg-red-600 hover:bg-red-700 text-white'
              disabled={loading}
            >
              {loading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                "Sí, eliminar categoría"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
