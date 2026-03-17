"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { updateBedroom } from "@/app/actions/bedrooms";
import { Loader2, Save, } from "lucide-react";
import Icon from "@/components/ui/icons/icons";
import { TypeBedrooms } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import GalleryImageUploader from "./add-image";

const FormSchema = z.object({
  typeBedroomId: z.string().min(1, "El tipo es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  lowSeasonPrice: z.coerce.number().min(1, "Precio inválido"),
  highSeasonPrice: z.coerce.number().min(1, "Precio inválido"),
  numberBedroom: z.coerce.number().min(1, "N° requerido"),
  capacity: z.coerce.number().min(1, "Capacidad mínima 1"),
  status: z.enum(["1", "0"]),
  seasonsId: z.string().min(1, "Selecciona temporada"),
});

export function FormEditBedrooms({ bedroom, seasons, roomTypes, setOpen }: any) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      typeBedroomId: bedroom.typeBedroomId?.toString() ?? "",
      description: bedroom.description || "",
      lowSeasonPrice: bedroom.lowSeasonPrice || 0,
      highSeasonPrice: bedroom.highSeasonPrice || 0,
      numberBedroom: bedroom.numberBedroom,
      capacity: bedroom.capacity,
      status: bedroom.status ? "1" : "0",
      seasonsId: bedroom.seasonsId?.toString() ?? "none",
    },
  });

  const now = new Date();
  const activeSeasons = seasons.filter((s: any) => new Date(s.dateEnd) >= now);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsPending(true);
    try {
      const res = await updateBedroom({
        ...data,
        typeBedroomId: Number(data.typeBedroomId),
        bedroomsId: bedroom.id.toString(),
        seasonsId: data.seasonsId === "none" ? null : Number(data.seasonsId),
      });

      if (res.success) {
        toast({
          title: "¡Actualizado!",
          description: "Cambios guardados correctamente.",
        });
        setOpen(false); // Cierra el modal automáticamente
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Fallo de conexión",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-6'
      >
        {/* CONTENEDOR CON SCROLL PARA MÓVIL */}
        <div className='space-y-6 overflow-y-auto max-h-[60vh] md:max-h-[65vh] pr-2 scrollbar-thin'>
          {/* SECCIÓN DE ESTADO OPERATIVO (AUTOMATIZADO) */}
          <div className='p-4 rounded-xl border-2 border-dashed bg-muted/20'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-bold flex items-center gap-2'>
                    Estado de la Habitación
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={`h-12 font-bold transition-all ${field.value === "1"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                          : "border-red-400 bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                          }`}
                      >
                        <SelectValue placeholder='Estado' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='dark:bg-slate-950 border-border shadow-2xl'>
                      <SelectItem
                        value='1'
                        className='text-emerald-600 dark:text-emerald-400 font-bold focus:bg-emerald-50 dark:focus:bg-emerald-900/30'
                      >
                        <div className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-emerald-500' />
                          ACTIVA (Disponible)
                        </div>
                      </SelectItem>
                      <SelectItem
                        value='0'
                        className='text-red-600 dark:text-red-400 font-bold focus:bg-red-50 dark:focus:bg-red-900/30'
                      >
                        <div className='flex items-center gap-2'>
                          <span className='h-2 w-2 rounded-full bg-red-400' />
                          INACTIVA (Ocupada)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className='text-[11px] leading-tight mt-1'>
                    Nota: Las reservaciones también marcan la habitación como ocupada automáticamente.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* GRID: 1 columna en móvil, 2 en PC */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='typeBedroomId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Habitación</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      const selected = roomTypes.find((t: TypeBedrooms) => t.id.toString() === val);
                      if (selected) {
                        form.setValue("description", selected.description);
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className='dark:bg-slate-900'>
                        <SelectValue placeholder='Selecciona tipo' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='dark:bg-slate-950'>
                      {roomTypes.map((t: any) => (
                        <SelectItem key={t.id} value={t.id.toString()}>
                          {t.nameType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='numberBedroom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Habitación</FormLabel>
                  <Input
                    type='number'
                    {...field}
                    className='dark:bg-slate-900'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder='Describe la habitación...'
                    rows={4}
                    className='resize-none dark:bg-slate-900'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='seasonsId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporada Asignada</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className='dark:bg-slate-900'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='dark:bg-slate-950'>
                    <SelectItem value='none'>Ninguna</SelectItem>
                    {activeSeasons.map((s: any) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.nameSeason} ({new Date(s.dateStart).toLocaleDateString()} - {new Date(s.dateEnd).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='lowSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Baja (C$)</FormLabel>
                  <Input
                    type='number'
                    {...field}
                    className='dark:bg-slate-900'
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='highSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Alta (C$)</FormLabel>
                  <Input
                    type='number'
                    {...field}
                    className='dark:bg-slate-900'
                  />
                </FormItem>
              )}
            />
          </div>

          <GalleryImageUploader
            bedroomId={bedroom.id}
            initialImages={bedroom.galleryImages}
            onImageUploaded={() => router.refresh()}
          />
        </div>

        {/* FOOTER FIJO ABAJO */}
        <DialogFooter className='flex flex-row gap-2 pt-4 border-t'>
          <Button
            type='button'
            variant='ghost'
            className='flex-1'
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            <Icon action='undo' className='mr-2' />
            Cancelar
          </Button>

          <Button
            type='submit'
            variant='success'
            className='flex-1 font-bold shadow-lg shadow-emerald-900/20'
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Guardando
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' /> Guardar Cambios
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
