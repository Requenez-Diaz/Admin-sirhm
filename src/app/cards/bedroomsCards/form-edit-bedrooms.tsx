"use client";

import { Button } from "@/components/ui/button";
import { updateBedroom } from "@/app/actions/bedrooms";
import { useRouter } from "next/navigation";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Bedrooms, BedroomImages, Seasons } from "@prisma/client"; // Importamos Seasons
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GalleryImageUploader from "./add-image";

const FormSchema = z.object({
  typeBedroom: z.string().min(1, "El tipo de habitación es obligatorio."),
  description: z.string().trim().min(1, "La descripción es obligatoria."),
  lowSeasonPrice: z.coerce.number().min(1, "Precio temporada baja requerido."),
  highSeasonPrice: z.coerce.number().min(1, "Precio temporada alta requerido."),
  numberBedroom: z.coerce.number().min(1, "Número de habitación requerido."),
  capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a cero."),
  seasonsId: z.coerce.number().min(1, "Debes seleccionar una temporada."), // Nuevo campo
  status: z.enum(["1", "0"]),
});

type BedroomsWithImages = Bedrooms & {
  galleryImages: BedroomImages[];
};

interface Props {
  bedroom: BedroomsWithImages | null;
  seasons: Seasons[]; // Recibimos las temporadas desde el componente padre
}

export function FormEditBedrooms({ bedroom, seasons }: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: bedroom
      ? {
          typeBedroom: bedroom.typeBedroom,
          description: bedroom.description,
          lowSeasonPrice: bedroom.lowSeasonPrice,
          highSeasonPrice: bedroom.highSeasonPrice,
          numberBedroom: bedroom.numberBedroom,
          capacity: bedroom.capacity,
          seasonsId: bedroom.seasonsId, // Valor inicial
          status: bedroom.status ? "1" : "0",
        }
      : {
          typeBedroom: "",
          description: "",
          lowSeasonPrice: 0,
          highSeasonPrice: 0,
          numberBedroom: 0,
          capacity: 1,
          seasonsId: undefined,
          status: "1",
        },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!bedroom) return;

    const formData = {
      ...data,
      bedroomsId: bedroom.id.toString(),
    };

    const response = await updateBedroom(formData);

    if (response.success) {
      toast({ title: "Actualizado", description: response.message });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  if (!bedroom) return <p>No se encontró la habitación</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='grid gap-6 py-4 max-h-[80vh] overflow-y-auto px-1'
      >
        <input type='hidden' name='bedroomsId' value={bedroom.id} />

        {/* --- Responsivo: 1 col en móvil, 2 en desktop --- */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='typeBedroom'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de habitación</FormLabel>
                <FormControl>
                  <Input {...field} disabled className='bg-muted' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='lowSeasonPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Temporada Baja</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='highSeasonPrice'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio Temporada Alta</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* NUEVO CAMPO: Temporada Actual */}
          <FormField
            control={form.control}
            name='seasonsId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporada Asignada</FormLabel>
                <select
                  {...field}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring'
                >
                  <option value=''>Selecciona...</option>
                  {seasons.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nameSeason}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='capacity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='numberBedroom'
            render={({ field }) => (
              <FormItem>
                <FormLabel>N° Habitación</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <select
                  {...field}
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                >
                  <option value='1'>Activo</option>
                  <option value='0'>Inactivo</option>
                </select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <GalleryImageUploader
          bedroomId={bedroom.id}
          initialImages={bedroom.galleryImages}
          onImageUploaded={() => router.refresh()}
        />

        <DialogFooter className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3'>
          <DialogClose asChild>
            <Button
              type='button'
              variant='outline'
              className='w-full sm:w-auto'
            >
              <Icon action='undo' className='mr-2' /> Cancelar
            </Button>
          </DialogClose>
          <Button type='submit' variant='success' className='w-full sm:w-auto'>
            <Icon action='save' className='mr-2' /> Actualizar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
