"use client";

import { updateReservation } from "@/app/actions/reservation";
import { getTypeBedrooms } from "@/app/actions/roomsType/rooms-type";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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
  reservationDetails,
}: {
  reservationDetails: any | null;
}) {
  const { toast } = useToast();
  const [bedroomsList, setBedroomsList] = useState<any[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      guests: 1,
      rooms: 1,
      bedroomsType: "",
      arrivalDate: "",
      departureDate: "",
    },
  });

  // EFECTO 1: Cargar los datos de la reservación en el formulario cuando lleguen
  useEffect(() => {
    if (reservationDetails) {
      form.reset({
        name: reservationDetails?.Reservation?.User?.username || "",
        lastName: "", // Sigue vacío porque no existe en tu User schema
        email: reservationDetails?.Reservation?.User?.email || "",
        guests: reservationDetails?.guestQuantity || 1,
        rooms: 1,
        bedroomsType: reservationDetails?.Bedrooms?.TypeBedrooms?.nameType || "",
        arrivalDate: reservationDetails?.dateStart
          ? new Date(reservationDetails.dateStart).toISOString().split("T")[0]
          : "",
        departureDate: reservationDetails?.dateEnd
          ? new Date(reservationDetails.dateEnd).toISOString().split("T")[0]
          : "",
      });
    }
  }, [reservationDetails, form]);

  // EFECTO 2: Cargar lista de habitaciones para el select
  useEffect(() => {
    async function fetchBedrooms() {
      const result = await getTypeBedrooms();
      if (result.success && result.data) {
        setBedroomsList(result.data);
      }
    }
    fetchBedrooms();
  }, []);

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!reservationDetails) {
      return toast({
        title: "Error",
        description: "No se encontró el detalle de la reservación",
      });
    }

    const formData = {
      reservationId: reservationDetails.reservation_id.toString(),
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
        description: "Los cambios se guardaron correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: response?.message || "Error al actualizar.",
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
                <FormLabel>Nombre (Username)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nombre" />
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
                  <Input {...field} type='email' placeholder="Email" />
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
                  <Input {...field} type='number' />
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
                  <Input {...field} type='number' />
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
                    className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <option value='' disabled>Selecciona tipo</option>
                    {bedroomsList.map((type: any) => (
                      <option key={type.id} value={type.nameType}>
                        {type.nameType}
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

        <DialogFooter className='pt-4 gap-4'>
          <DialogClose asChild>
            <Button type='button' variant='ghost'>Cancelar</Button>
          </DialogClose>
          <Button type='submit' variant='success'>Actualizar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default FormEditReservation;