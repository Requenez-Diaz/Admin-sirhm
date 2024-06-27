'use client';

import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { saveBedrooms } from "../actions/reservations";
import { Button } from "@/components/ui/button";

export  function FormBedrooms() {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await saveBedrooms(new FormData(event.currentTarget));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='typeBedroom' className='text-right'>
                        Tipo de habitación
                    </label>
                    <select
                        id='typeBedroom'
                        name='typeBedroom'
                        className='col-span-3'
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
                        placeholder="Descripción de la habitación"
                        className='col-span-3'
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
                        className='col-span-3'
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
                        className='col-span-3'
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='status' className='text-right'>
                        Estado
                    </label>
                    <input
                        id='status'
                        name='status'
                        className='col-span-3'
                    />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                    <label htmlFor='numberBedroom' className='text-right'>
                        Número de habitación
                    </label>
                    <input
                        id='numberBedroom'
                        name='numberBedroom'
                        type='number'
                        className='col-span-3'
                    />
                </div>
            </div>
            <Button variant='destructive'>Cancelar</Button>
            <Button type='submit'>Agregar</Button>
        </form>
    )
}

export default FormBedrooms;