"use client";

import React from "react";
import { type VariantProps } from "class-variance-authority";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditBedrooms } from "@/app/cards/edit-bedrooms";
import { saveBedrooms } from "@/app/actions/reservations";
import { AddBedrooms } from "@/app/cards/add-bedrooms";
import { DeleteBedrooms } from "@/app/cards/delete-beedrooms";

const bedrooms = [
  {
    id: 1,
    typeBedroom: "Simple",
    description: "Habitación con cama simple",
    lowSeasonPrise: 100,
    highSeasonPrise: 150,
    status: "Disponible",
    numberBedroom: 1,
  },
  {
    id: 2,
    typeBedroom: "Doble",
    description: "Habitación con cama doble",
    lowSeasonPrise: 200,
    highSeasonPrise: 300,
    status: "Disponible",
    numberBedroom: 2,
  },
  {
    id: 3,
    typeBedroom: "Triple",
    description: "Habitación con cama triple",
    lowSeasonPrise: 300,
    highSeasonPrise: 450,
    status: "Disponible",
    numberBedroom: 3,
  },
  {
    id: 4,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 4,
  },
  {
    id: 5,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 5,
  },
  {
    id: 6,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 6,
  },
  {
    id: 7,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 7,
  },
  {
    id: 8,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 8,
  },
  {
    id: 9,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 9,
  },
  {
    id: 10,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 10,
  },
  {
    id: 11,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Disponible",
    numberBedroom: 11,
  },
  {
    id: 12,
    typeBedroom: "Suite",
    description: "Habitación con cama king size",
    lowSeasonPrise: 400,
    highSeasonPrise: 600,
    status: "Ocupado",
  },
];

const HabitacionesPage = () => {
  const createBedroom = () => {
    console.log("Crear habitación");
  };

  return (
    <div>
      <form action={saveBedrooms}>
        <Table>
          <TableCaption>Listado de habitaciones</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Habitaciones </TableHead>
              <TableHead>Temporada baja</TableHead>
              <TableHead>Temporada alta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Tamaño</TableHead>
              <TableHead className='text-right items-center'>
                Acciones
                <Button variant='success' className='ml-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='2'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    className='lucide lucide-plus mr-2'
                  >
                    <path d='M5 12h14' />
                    <path d='M12 5v14' />
                  </svg>
                  Agregar habitación
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bedrooms.map((bedroom) => (
              <TableRow key={bedroom.id}>
                <TableCell className='font-medium'>
                  {bedroom.description}
                </TableCell>
                <TableCell>{bedroom.lowSeasonPrise}</TableCell>
                <TableCell>{bedroom.highSeasonPrise}</TableCell>
                <TableCell>{bedroom.status}</TableCell>
                <TableCell className='text-right'>
                  {bedroom.typeBedroom}
                </TableCell>
                <TableCell className='text-right flex items-center justify-center'>
                  <div className='flex justify-between gap-3'>
                    <EditBedrooms />
                    <DeleteBedrooms />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

export default HabitacionesPage;
