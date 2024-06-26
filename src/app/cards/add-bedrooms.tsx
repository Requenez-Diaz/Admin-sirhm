"use client";
import { useState } from "react";
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

export function AddBedrooms() {
  const [formData, setFormData] = useState({
    typeBedroom: "",
    description: "",
    lowSeasonPrice: "",
    highSeasonPrice: "",
    status: "",
    numberBedroom: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    form.append("typeBedroom", formData.typeBedroom);
    form.append("description", formData.description);
    form.append("lowSeasonPrice", formData.lowSeasonPrice);
    form.append("highSeasonPrice", formData.highSeasonPrice);
    form.append("status", formData.status);
    form.append("numberBedroom", formData.numberBedroom);

    const response = await saveBedrooms(form);
    console.log(response);
  };

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
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='typeBedroom' className='text-right'>
                Tipo de habitación
              </Label>
              <Input
                id='typeBedroom'
                name='typeBedroom'
                value={formData.typeBedroom}
                onChange={handleChange}
                className='col-span-3'
              />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='description' className='text-right'>
                Descripción
              </Label>
              <Input
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
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
                value={formData.lowSeasonPrice}
                onChange={handleChange}
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
                value={formData.highSeasonPrice}
                onChange={handleChange}
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
                value={formData.status}
                onChange={handleChange}
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
                value={formData.numberBedroom}
                onChange={handleChange}
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
