"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader2, Save, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  createTypeBedroom,
  updateTypeBedroom,
} from "@/app/actions/roomsType/rooms-type";

interface TypeBedroomFormProps {
  initialData?: {
    id: number;
    nameType: string;
    description: string;
  };
}

export default function TypeBedroomForm({ initialData }: TypeBedroomFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const isEditing = !!initialData;
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nameType: initialData?.nameType || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: { nameType: string; description: string }) => {
    setLoading(true);

    const result = isEditing
      ? await updateTypeBedroom(initialData.id, data)
      : await createTypeBedroom(data);

    setLoading(false);

    if (result.success) {
      toast({
        title: isEditing ? "Actualizado" : "Creado",
        description: `La categoría se ha ${isEditing ? "actualizado" : "creado"} con éxito.`,
      });
      if (!isEditing) reset();
      setOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-blue-500'
          >
            <Edit className='w-4 h-4' />
          </Button>
        ) : (
          <Button className='flex gap-2' variant={"success"}>
            <Plus className='w-4 h-4' />
            <span>Nuevo Tipo</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-black uppercase tracking-tight'>
            {isEditing ? "Editar Categoría" : "Agregar Categoría"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 pt-4'>
          <div className='space-y-2'>
            <label className='text-xs font-bold uppercase text-muted-foreground'>
              Nombre del Tipo
            </label>
            <Input
              {...register("nameType", { required: true })}
              placeholder='Ej: Suite Presidencial'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-bold uppercase text-muted-foreground'>
              Descripción
            </label>
            <Textarea
              {...register("description", { required: true })}
              placeholder='Características de la categoría...'
              className='resize-none h-32'
            />
          </div>

          <div className='flex justify-end gap-3 pt-2'>
            <Button
              type='button'
              variant='destructive'
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type='submit'
              variant={"success"}
              disabled={loading}
              className='min-w-[120px]'
            >
              {loading ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <>
                  {isEditing ? (
                    <Save className='w-4 h-4 mr-2' />
                  ) : (
                    <Plus className='w-4 h-4 mr-2' />
                  )}
                  {isEditing ? "Guardar Cambios" : "Crear Tipo"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
