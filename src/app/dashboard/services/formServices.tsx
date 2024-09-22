"use client";

import { saveService } from "@/app/actions/services";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function FormServices() {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await saveService(new FormData(event.currentTarget));

        if (response.success) {
            toast({
                title: "Servicio registrado.",
                description: "El servicio se registró correctamente.",
            });
        } else {
            toast({
                title: "Servicio no registrado.",
                description: response.message || "Ha ocurrido un error al registrar el servicio.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='nameService' className='text-right'>
                        Nombre del Servicio
                    </Label>
                    <Input
                        type='text'
                        id='nameService'
                        name='nameService'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
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
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='price' className='text-right'>
                        Precio
                    </Label>
                    <Input
                        id='price'
                        name='price'
                        type='number'
                        min='0'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                    />
                </div>
                <div className='flex justify-end gap-4'>
                    <DialogClose asChild>
                        <Button type='button' variant='success'>
                            <Icon action='undo' className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type='submit' variant='update'>
                            <Icon action='save' className="mr-2" />
                            Registrar
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </form>
    );
}

export default FormServices;