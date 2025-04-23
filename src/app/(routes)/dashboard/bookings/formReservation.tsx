'use client';

import { saveReservation } from '@/app/actions/reservation';
import { bedroomsTypes } from '@/bedroomstype/bedroomsType';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import Icon from '@/components/ui/icons/icons';
import { Input } from '@/components/ui/input';
import { useToast } from "@/components/ui/use-toast";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const FormSchema = z.object({
    name: z.string().trim().min(1, "El nombre es obligatorio."),
    lastName: z.string().trim().min(1, "El apellido es obligatorio."),
    email: z.string().trim().email("Introduce un correo electrónico válido."),
    guests: z.coerce.number().min(1, "Debe haber al menos 1 huésped."),
    rooms: z.coerce.number().min(1, "Debe seleccionar al menos una habitación."),
    bedroomsType: z.string().min(1, "Selecciona un tipo de habitación."),
    arrivalDate: z.string().min(1, "La fecha de llegada es obligatoria."),
    departureDate: z.string().min(1, "La fecha de salida es obligatoria."),
});

interface FormReservationProps {
    onSubmitSuccess?: () => void;
}

export function FormReservation({ onSubmitSuccess }: FormReservationProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            guests: undefined,
            rooms: undefined,
            bedroomsType: "",
            arrivalDate: "",
            departureDate: "",
        },
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        const response = await saveReservation({
            ...data,
            arrivalDate: new Date(data.arrivalDate),
            departureDate: new Date(data.departureDate),
        });

        if (response.success) {
            toast({
                title: "Reserva realizada.",
                description: "La reservación se registró correctamente.",
            });
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } else {
            toast({
                title: "Reserva no realizada.",
                description: response.message || "Ha ocurrido un error al realizar la reservación.",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nombre" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Apellido</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Apellido" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="Correo electrónico" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Huéspedes</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="1" placeholder="Número de huéspedes" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="rooms"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Habitaciones</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" min="1" placeholder="Cantidad de habitaciones" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bedroomsType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de habitación</FormLabel>
                                <FormControl>
                                    <select {...field} className="border border-gray-300 rounded-lg p-2">
                                        <option value="" disabled>Selecciona el tipo</option>
                                        {bedroomsTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="arrivalDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de llegada</FormLabel>
                                <FormControl>
                                    <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departureDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de salida</FormLabel>
                                <FormControl>
                                    <Input {...field} type="date" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <DialogFooter className="flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button type="button" variant="success">
                            <Icon action='undo' className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>

                    <Button type="submit" variant="update">
                        <Icon action='save' className="mr-2" />
                        Reservar
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

export default FormReservation;