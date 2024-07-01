'use client';

import { Button } from "@/components/ui/button";
import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { bedrooms } from "@prisma/client";
import { updateBedroom } from "../actions/reservations";
import { useRouter } from "next/navigation";

export function FormEditBedrooms({ bedroom, }: { bedroom: bedrooms | null }) {
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
                    <input
                        type='text'
                        id='status'
                        name='status'
                        className='col-span-3 border border-gray-300 rounded px-2 py-1'
                        defaultValue={bedroom.status ? '1' : '0'}
                    />
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
                    <Button variant='success'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-undo-2 mr-2">
                            <path d="M9 14 4 9l5-5" />
                            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                        </svg>
                        Cancelar
                    </Button>
                    <Button type='submit' variant='update'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-save-all mr-2">
                            <path d="M10 2v3a1 1 0 0 0 1 1h5" />
                            <path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" />
                            <path d="M18 22H4a2 2 0 0 1-2-2V6" />
                            <path d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z" />
                        </svg>
                        Actualizar
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default FormEditBedrooms;
