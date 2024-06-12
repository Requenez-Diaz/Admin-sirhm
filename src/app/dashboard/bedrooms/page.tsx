import React from "react";

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {bedrooms.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className='font-medium'>
                {invoice.description}
              </TableCell>
              <TableCell>{invoice.lowSeasonPrise}</TableCell>
              <TableCell>{invoice.highSeasonPrise}</TableCell>
              <TableCell>{invoice.status}</TableCell>

              <TableCell className='text-right'>
                {invoice.typeBedroom}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className='text-right'>$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default HabitacionesPage;
