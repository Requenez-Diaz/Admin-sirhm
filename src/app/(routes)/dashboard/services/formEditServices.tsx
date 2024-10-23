"use client";

import { updateService } from "@/app/actions/services";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Services } from "@prisma/client";

const FormSchema = z.object({
    nameService: z.string().trim().min(1, "El nombre del servicio es obligatorio."),
    description: z.string().trim().min(1, "La descripción es obligatoria."),
    price: z.coerce.number().min(1, "El precio debe ser mayor a cero."),
});

export function FormEditServices({ service }: { service: Services | null }) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nameService: service?.nameService,
            description: service?.description,
            price: service?.price,
        },
    });

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        const formData = new FormData();
        formData.append("serviceId", service?.id.toString() || '');
        formData.append("nameService", data.nameService);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());

        const response = await updateService(formData);

        if (response.success) {
            toast({
                title: "Servicio actualizado.",
                description: "El servicio se actualizó correctamente.",
            });
        } else {
            toast({
                title: "Error",
                description: response.message || "No se pudo actualizar el servicio.",
            });
        }
    };

    if (!service) {
        return <p>Error: No se encontró el servicio.</p>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 py-4'>
                <FormField
                    control={form.control}
                    name='nameService'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre del Servicio</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Nombre del servicio'
                                    {...field}
                                />
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
                                <Input
                                    type='text'
                                    placeholder='Descripción del servicio'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='price'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    min='1'
                                    placeholder='Precio del servicio'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end gap-4'>
                    <DialogClose asChild>
                        <Button type='button' variant='success'>
                            <Icon action='undo' className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button type='submit' variant='update'>
                        <Icon action='save' className="mr-2" />
                        Actualizar
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default FormEditServices;