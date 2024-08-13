'use client';

import { Button } from "@/components/ui/button";
import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { bedrooms } from "@prisma/client";
import { updateBedroom } from "@/app/actions/bedrooms/updateBedrooms";
import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Undo2, SaveAll } from 'lucide-react';

export function FormEditBedrooms({ bedroom, }: { bedroom: bedrooms | null }) {
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('bedroomsId', bedroom?.id.toString() || '');
        await updateBedroom(formData);
        router.refresh();
    };

    if (!bedroom) {
        return <p>Error: No se encontró la habitación</p>;
    }

    return (
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
            <div className='grid gap-4 py-4'>
                <input type='hidden' name='bedroomsId' value={bedroom.id} />
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
                    <label htmlFor='description' className='text-right'>Descripción</label>
                    <input
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        type='text'
                        id='description'
                        name='description'
                        required
                        defaultValue={bedroom.description}
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='lowSeasonPrice' className='text-right'>Temporada baja</label>
                    <input
                        type='number'
                        id='lowSeasonPrice'
                        name='lowSeasonPrice'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                        defaultValue={bedroom.lowSeasonPrice}
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='highSeasonPrice' className='text-right'>Temporada alta</label>
                    <input
                        type='number'
                        id='highSeasonPrice'
                        name='highSeasonPrice'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        required
                        defaultValue={bedroom.highSeasonPrice}
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='status' className='text-right'>Estado</label>
                    <select
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        id="status"
                        name="status"
                        defaultValue={bedroom.status ? '1' : '0'}
                    >
                        <option value="0">Inactivo</option>
                        <option value="1">Activo</option>
                    </select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='numberBedroom' className='text-right'>Número de habitación</label>
                    <input
                        type='number'
                        id='numberBedroom'
                        name='numberBedroom'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        defaultValue={bedroom.numberBedroom}
                        required
                    />
                </div>
                <div className='flex justify-end gap-4'>
                    <DialogClose asChild>
                        <Button type="button" variant="success">
                            <Undo2 className="mr-2" />
                            Cancelar
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type='submit'
                            variant='update'
                            onClick={() => {
                                toast({
                                    title: "Habitación actualizada.",
                                    description: "La habitación se actualizo correctamente.",
                                });
                            }}
                        >
                            <SaveAll className="mr-2" />
                            Actualizar
                        </Button>
                    </DialogClose>
                </div>
            </div>
        </form>
    );
}

export default FormEditBedrooms;
