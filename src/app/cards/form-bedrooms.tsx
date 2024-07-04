'use client';

import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { saveBedrooms } from "../actions/reservations";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export function FormBedrooms() {
    const { toast } = useToast();

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const response = await saveBedrooms(new FormData(event.currentTarget));

        if (response.success) {
            toast({
                title: "Habitación registrada.",
                description: "La habitación se registró correctamente.",
            });
        } else {
            toast({
                title: "Habitación no registrada.",
                description: "La habitación ya existe.",
            });
        }

        if (formRef.current) {
            formRef.current.reset();
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='typeBedroom' className='text-right'>
                        Tipo de habitación
                    </label>
                    <select
                        id='typeBedroom'
                        name='typeBedroom'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                    >
                        {bedroomsTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='description' className='text-right'>
                        Descripción
                    </label>
                    <input
                        type="text"
                        id='description'
                        name='description'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                    />
                </div>

                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='lowSeasonPrice' className='text-right'>
                        Temporada baja
                    </label>
                    <input
                        id='lowSeasonPrice'
                        name='lowSeasonPrice'
                        type='number'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='highSeasonPrice' className='text-right'>
                        Temporada alta
                    </label>
                    <input
                        id='highSeasonPrice'
                        name='highSeasonPrice'
                        type='number'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='status' className='text-right'>
                        Estado
                    </label>
                    <select id="status"
                        name="status"
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                    >
                        <option value="0">Inactivo</option>
                        <option value="1">Activo</option>
                    </select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='numberBedroom' className='text-right'>
                        Número de habitación
                    </label>
                    <input
                        id='numberBedroom'
                        name='numberBedroom'
                        type='number'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                    />
                </div>
                <div className='flex justify-end gap-4'>
                    <DialogClose asChild>
                        <Button type="button" variant="success">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-undo-2 mr-2"
                            >
                                <path d="M9 14L4 9l5-5" />
                                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11" />
                            </svg>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button
                        type='submit'
                        variant='update'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-all mr-2">
                            <path d="M10 2v3a1 1 0 0 0 1 1h5" />
                            <path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" />
                            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                            <path d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z" />
                        </svg>
                        Registrar
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default FormBedrooms;