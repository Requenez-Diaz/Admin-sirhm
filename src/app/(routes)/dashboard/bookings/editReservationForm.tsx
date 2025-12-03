"use client";

import { updateReservation } from "@/app/actions/reservation";
import { getBedrooms } from "@/app/actions/bedrooms";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import Icon from "@/components/ui/icons/icons";
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
  email: z.string().trim().email("Introduce un correo electrónico válido."),
  guests: z.coerce.number().min(1, "Debe haber al menos 1 huésped."),
  bedroomsId: z.string().min(1, "El tipo de habitación es requerido."),
  arrivalDate: z.string().min(1, "La fecha de llegada es requerida."),
  departureDate: z.string().min(1, "La fecha de salida es requerida."),
}).refine((data) => {
  const arrival = new Date(data.arrivalDate);
  const departure = new Date(data.departureDate);
  return departure > arrival;
}, {
  message: "La fecha de salida debe ser posterior a la fecha de llegada.",
  path: ["departureDate"],
});

export function FormEditReservation({
  reservation,
}: {
  reservation: any;
}) {
  const { toast } = useToast();
  const [bedrooms, setBedrooms] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const details = reservation?.ReservationDetails?.[0];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: reservation?.User?.email || "",
      guests: details?.guestQuantity || 1,
      bedroomsId: details?.bedrooms_id?.toString() || "",
      arrivalDate: details?.dateStart
        ? new Date(details.dateStart).toISOString().split("T")[0]
        : "",
      departureDate: details?.dateEnd
        ? new Date(details.dateEnd).toISOString().split("T")[0]
        : "",
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
        variant: "destructive",
      });
    }

    setIsSubmitting(true);

    try {
      const response = await updateReservation({
        reservationId: reservation.id.toString(),
        email: data.email,
        guests: data.guests.toString(),
        bedroomsId: data.bedroomsId,
        arrivalDate: data.arrivalDate,
        departureDate: data.departureDate,
      });

      if (response?.success) {
        toast({
          title: "✓ Reservación actualizada",
          description: "La reservación se actualizó correctamente.",
        });
        // Opcional: cerrar el diálogo después de actualizar
        setTimeout(() => {
          const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
          closeButton?.click();
        }, 1000);
      } else {
        toast({
          title: "Error al actualizar",
          description: response?.message || "Error al actualizar la reservación.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        {/* Email */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input {...field} type='email' placeholder='Correo electrónico' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Guests + Bedrooms */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='guests'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huéspedes</FormLabel>
                <FormControl>
                  <Input {...field} type='number' min='1' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bedroomsId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de habitación</FormLabel>
                <FormControl>
                  <select {...field} className='border rounded-lg p-2'>
                    <option value='' disabled>
                      Selecciona habitación
                    </option>
                    {bedrooms.map((b) => (
                      <option key={b.id} value={b.id.toString()}>
                        {b.typeBedroom}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Arrival / Departure */}
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

        <DialogFooter className='flex justify-between pt-4'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              <Icon action='undo' className='mr-2' />
              Cancelar
            </Button>
          </DialogClose>

          <Button type='submit' variant='success' disabled={isSubmitting}>
            <Icon action='save' className='mr-2' />
            {isSubmitting ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default FormEditReservation;
