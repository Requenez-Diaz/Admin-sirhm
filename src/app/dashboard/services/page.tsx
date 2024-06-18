import { Button } from "@/components/ui/button";
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
import React from "react";

export default function Page() {
  const services = [
    {
      id: 1,
      nameServise: "Servicio 1",
      description: "Descripcion del servicio 1",
      price: "100",
      booking: "10",
    },
    {
      id: 2,
      nameServise: "Servicio 2",
      description: "Descripcion del servicio 2",
      price: "200",
      booking: "20",
    },
    {
      id: 3,
      nameServise: "Servicio 3",
      description: "Descripcion del servicio 3",
      price: "300",
      booking: "30",
    },
    {
      id: 4,
      nameServise: "Servicio 4",
      description: "Descripcion del servicio 4",
      price: "400",
      booking: "40",
    },
  ];
  return (
    <div>
      <Table>
        <TableCaption>Listados de habitaciones</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID </TableHead>
            <TableHead>Servicio</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className='text-right'>N. Reserva</TableHead>
            <TableHead className='text-right items-center'>
              Acciones
              <Button variant={"ghost"} className='mr-4'>
                Agregar Servicio
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className='font-medium'>{service.id}</TableCell>
              <TableCell>{service.nameServise}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>{service.price}</TableCell>
              <TableCell className='text-right'>{service.booking}</TableCell>
              <TableCell className='text-right flex items-center justify-center'>
                <div className='flex justify-between gap-3 '>
                  <Button variant={"ghost"}>Editar</Button>
                  <Button variant={"destructive"}>Eliminar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
