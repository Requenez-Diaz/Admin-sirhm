"use client";

import { Button } from "@/components/ui/button";
import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { updateBedroom } from "@/app/actions/bedrooms";
import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Bedrooms } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const FormSchema = z.object({
    typeBedroom: z.string().min(1, "El tipo de habitación es obligatorio."),
    description: z.string().min(1, "La descripción es obligatoria."),
    lowSeasonPrice: z.coerce.number().min(1, "El precio en temporada baja debe ser mayor que cero."),
    highSeasonPrice: z.coerce.number().min(1, "El precio en temporada alta debe ser mayor que cero."),
    numberBedroom: z.coerce.number().min(1, "El número de habitación debe ser mayor que cero."),
    capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a cero."),
    status: z.enum(["1", "0"]).refine((val) => val !== undefined, {
        message: "El estado es obligatorio.",
    }),
});

export function FormEditBedrooms({ bedroom }: { bedroom: Bedrooms | null }) {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: bedroom ? {
            typeBedroom: bedroom.typeBedroom,
            description: bedroom.description,
            lowSeasonPrice: bedroom.lowSeasonPrice,
            highSeasonPrice: bedroom.highSeasonPrice,
            numberBedroom: bedroom.numberBedroom,
            capacity: bedroom.capacity,
            status: bedroom.status ? '1' : '0',
        } : {
            typeBedroom: "",
            description: "",
            lowSeasonPrice: undefined,
            highSeasonPrice: undefined,
            numberBedroom: undefined,
            capacity: undefined,
            status: "1",
        },
    });

    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formData = {
            bedroomsId: bedroom?.id.toString() || '',
            typeBedroom: data.typeBedroom,
            description: data.description,
            lowSeasonPrice: data.lowSeasonPrice,
            highSeasonPrice: data.highSeasonPrice,
            numberBedroom: data.numberBedroom,
            capacity: data.capacity,
            status: data.status,
        };

        const response = await updateBedroom(formData);

        if (response.success) {
            toast({
                title: "Habitación actualizada.",
                description: response.message,
            });
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: response.message || "Ha ocurrido un error al actualizar la habitación.",
            });
        }
    };

    if (!bedroom) {
        return <p>Error: No se encontró la habitación</p>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='grid gap-4 py-4'>
                <input type='hidden' name='bedroomsId' value={bedroom.id} />

                <div className='grid grid-cols-2 gap-4'>
                    <FormField
                        control={form.control}
                        name='typeBedroom'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de habitación</FormLabel>
                                <FormControl>
                                    <select
                                        id='typeBedroom'
                                        {...field}
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
                                    >
                                        <option value="" disabled>Selecciona un tipo</option>
                                        {bedroomsTypes.map((type, index) => (
                                            <option key={index} value={type}>{type}</option>
                                        ))}
                                    </select>
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
                                    <input
                                        id='description'
                                        type='text'
                                        placeholder='Descripción de la habitación'
                                        {...field}
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
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
                        name='lowSeasonPrice'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temporada baja</FormLabel>
                                <FormControl>
                                    <input
                                        id='lowSeasonPrice'
                                        type='number'
                                        min='1'
                                        placeholder='Precio temporada baja'
                                        {...field}
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
                                    />
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
                                <FormLabel>Temporada alta</FormLabel>
                                <FormControl>
                                    <input
                                        id='highSeasonPrice'
                                        type='number'
                                        min='1'
                                        placeholder='Precio temporada alta'
                                        {...field}
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacidad</FormLabel>
                                <FormControl>
                                    <input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        placeholder="Capacidad de la habitación"
                                        {...field}
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
                        name='numberBedroom'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de habitación</FormLabel>
                                <FormControl>
                                    <input
                                        id='numberBedroom'
                                        type='number'
                                        min='1'
                                        placeholder='Número de habitación'
                                        {...field}
                                        className='border border-gray-300 rounded px-2 py-1 w-full'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <label htmlFor='status' className='text-right'>Estado</label>
                        <select
                            id='status'
                            {...form.register('status')}
                            className='border border-gray-300 rounded px-2 py-1 w-full'
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <DialogClose asChild>
                        <Button type="button" variant="success">
                            <Icon action="undo" className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>

                    {/* <DialogClose asChild> */}
                    <Button type="submit" variant="update">
                        <Icon action="save" className="mr-2" />
                        Actualizar
                    </Button>
                    {/* </DialogClose> */}
                </div>

            </form>
        </Form>
    );
}

export default FormEditBedrooms;