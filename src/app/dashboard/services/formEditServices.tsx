"use client";

import { updateService } from "@/app/actions/services";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Services } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function FormEditServices({ service }: { service: Services | null }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('serviceId', service?.id.toString() || '');
        await updateService(formData);

        if (!service) {
            return <p>Error: No se encontró el servicio.</p>;
        }
    };

    return (
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
            <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='description' className='text-right'>
                        Nombre del Servicio
                    </Label>
                    <Input
                        type='text'
                        id='nameService'
                        name='nameService'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                        defaultValue={service?.nameService}
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='description' className='text-right'>
                        Descripción
                    </Label>
                    <Input
                        type='text'
                        id='description'
                        name='description'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        defaultValue={service?.description}
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='price' className='text-right'>
                        Precio
                    </Label>
                    <Input
                        type='number'
                        id='price'
                        name='price'
                        min='0'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                        defaultValue={service?.price}
                    />
                </div>
                <div className='flex justify-end gap-4'>
                    <DialogClose asChild>
                        <Button type="button"
                            variant="success">
                            <Icon action='undo' className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type='submit'
                            variant='update'
                            onClick={() => {
                                toast({
                                    title: "Servicio actualizada.",
                                    description: "El Servicio se actualizo correctamente.",
                                });
                            }}
                        >
                            <Icon action='save' className="mr-2" />
                            Actualizar
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </form>
    );
}

export default FormEditServices;