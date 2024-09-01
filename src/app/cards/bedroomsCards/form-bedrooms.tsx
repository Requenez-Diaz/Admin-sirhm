"use client";

import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { saveBedrooms } from "@/app/actions/bedrooms";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";

export function FormBedrooms() {
  const { toast } = useToast();

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
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='typeBedroom' className='text-right'></label>
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
            type='text'
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
          <select
            id='status'
            name='status'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
          >
            <option value='0'>Inactivo</option>
            <option value='1'>Activo</option>
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

export default FormBedrooms;
