// "use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveBedrooms } from "../actions/reservations";
import { bedroomsTypes } from "@/bedroomstype/bedroomsType";

export function AddBedrooms() {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost'>Agregar</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Agregar habitación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea agregar esta habitación?
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='typeBedroom' className='text-right'>
                Tipo de habitación
              </Label>
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
              <Label htmlFor='description' className='text-right'>
                Descripción
              </Label>
              <Input
                id='description'
                name='description'
                className='col-span-3'
              />
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='lowSeasonPrice' className='text-right'>
                Temporada baja
              </Label>
              <Input
                id='lowSeasonPrice'
                name='lowSeasonPrice'
                type='number'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='highSeasonPrice' className='text-right'>
                Temporada alta
              </Label>
              <Input
                id='highSeasonPrice'
                name='highSeasonPrice'
                type='number'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Estado
              </Label>
              <Input
                id='status'
                name='status'
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='numberBedroom' className='text-right'>
                Número de habitación
              </Label>
              <Input
                id='numberBedroom'
                name='numberBedroom'
                type='number'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='destructive'>Cancelar</Button>
            <Button type='submit'>Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
