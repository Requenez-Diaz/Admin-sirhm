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
import { DeleteBedrooms } from "@/app/cards/delete-beedrooms";
import { EditBedrooms } from "@/app/cards/edit-bedrooms";

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
  return (
    <div>
      <Table>
        <TableCaption>Listado de habitaciones</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Habitaciones </TableHead>
            <TableHead>Temporada baja</TableHead>
            <TableHead>Temporada alta</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className='text-right'>Tamanio</TableHead>
            <TableHead className='text-right items-center'>
              Acciones
              <Button variant= 'success' className='mr-4'>
                Agregar habitción
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
                <div className='flex justify-between gap-3 '>
                  <EditBedrooms />
                  <DeleteBedrooms />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className='text-right'>$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  );
};

export default HabitacionesPage;
