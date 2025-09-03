"use client";

import { updateReservation } from "@/app/actions/reservation";
import { getBedrooms } from "@/app/actions/bedrooms"; // Asegúrate de que esta sea la ruta correcta
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Icon from "@/components/ui/icons/icons";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Reservation } from "@prisma/client";
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
import { useEffect, useState } from "react";

const FormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio."),
  lastName: z.string().trim().min(1, "El apellido es obligatorio."),
  email: z.string().trim().email("Introduce un correo electrónico válido."),
  guests: z.coerce.number().min(1, "Debe haber al menos 1 huésped."),
  rooms: z.coerce.number().min(1, "Debe seleccionar al menos una habitación."),
  bedroomsType: z.string().min(1, "El tipo de habitación es requerido."),
  arrivalDate: z.string().min(1, "La fecha de llegada es requerida."),
  departureDate: z.string().min(1, "La fecha de salida es requerida."),
});

export function FormEditReservation({
  reservation,
}: {
  reservation: Reservation | null;
}) {
  const { toast } = useToast();
  const [bedrooms, setBedrooms] = useState<
    {
      status: boolean;
      id: number;
      createdAt: Date;
      updatedAt: Date;
      image: string;
      typeBedroom: string;
      description: string;
      lowSeasonPrice: number;
      highSeasonPrice: number;
      numberBedroom: number;
      seasonsId: number;
      amenities: string[];
      capacity: number;
      slug: string;
    }[]
  >([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: reservation?.name,
      lastName: reservation?.lastName,
      email: reservation?.email,
      guests: reservation?.guests,
      rooms: reservation?.rooms,
      bedroomsType: reservation?.bedroomsType,
      arrivalDate: reservation?.arrivalDate.toISOString().split("T")[0],
      departureDate: reservation?.departureDate.toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    async function fetchBedrooms() {
      const data = await getBedrooms();
      setBedrooms(data);
    }
    fetchBedrooms();
  }, []);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!reservation) {
      return toast({
        title: "Error",
        description: "No se encontró la reservación",
      });
    }

    const formData = {
      reservationId: reservation?.id.toString() || "",
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      guests: data.guests.toString(),
      rooms: data.rooms.toString(),
      bedroomsType: data.bedroomsType,
      arrivalDate: data.arrivalDate,
      departureDate: data.departureDate,
    };

    const response = await updateReservation(formData);
    if (response?.success) {
      toast({
        title: "Reservación actualizada.",
        description: "La reservación se actualizó correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: response?.message || "Error al actualizar la reservación.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Nombre' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Apellido' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='Correo electrónico'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='guests'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huéspedes</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    min='1'
                    placeholder='Número de personas'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='rooms'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Habitaciones</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    min='1'
                    placeholder='Cantidad de habitaciones'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='bedroomsType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de habitación</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className='border border-gray-300 rounded-lg p-2'
                  >
                    <option value='' disabled>
                      Selecciona el tipo de habitación
                    </option>
                    {bedrooms.map((type: any, index: number) => (
                      <option key={index} value={type.typeBedroom}>
                        {type.typeBedroom}{" "}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='arrivalDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de llegada</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='departureDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de salida</FormLabel>
                <FormControl>
                  <Input {...field} type='date' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className='flex flex-wrap justify-between pt-4 gap-4'>
          <DialogClose asChild>
            <Button type='button' variant='success'>
              <Icon action='undo' className='mr-2' />
              Cancelar
            </Button>
          </DialogClose>

          <Button type='submit' variant='success'>
            <Icon action='save' className='mr-2' />
            Actualizar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default FormEditReservation;
