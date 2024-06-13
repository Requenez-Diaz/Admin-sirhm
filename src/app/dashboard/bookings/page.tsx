import { Button } from "@/components/ui/button";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

import React from "react";

const bookings = [
  {
    id: 1,
    clientId: 3,
    status: "Pendiente",
    checkIn: "2021-10-10",
    checkOut: "2021-10-20",
    totalPrise: 2000,
    client: "Juan Perez",
    bookingsDetails: "Habitación simple",
    bookingsServices: "Desayuno",
  },
  {
    id: 2,
    clientId: 4,
    status: "Pendiente",
    checkIn: "2021-10-10",
    checkOut: "2021-10-20",
    totalPrise: 2000,
    client: "Maria Perez",
    bookingsDetails: "Habitación doble",
    bookingsServices: "Desayuno",
  },
  {
    id: 3,
    clientId: 5,
    status: "Pendiente",
    checkIn: "2021-10-10",
    checkOut: "2021-10-20",
    totalPrise: 2000,
    client: "Pedro Perez",
    bookingsDetails: "Habitación triple",
    bookingsServices: "Desayuno",
  },
];

export default function Page() {
  return (
    <div>
      <Table>
        <TableCaption>Listado de reservas</TableCaption>
        <TableHeader>
          <TableRow className=''>
            <TableHead className='w-[100px]'>ID </TableHead>
            <TableHead className='w-[100px]'>Cliente ID</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Precio total</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead className='text-right'>Servicios</TableHead>

            <TableHead className='text-right items-center'>
              Acciones
              <Button variant={"ghost"} className='mr-4'>
                Agregar habitación
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className='font-medium'>{booking.id}</TableCell>
              <TableCell>{booking.clientId}</TableCell>
              <TableCell>{booking.status}</TableCell>
              <TableCell>{booking.checkIn}</TableCell>
              <TableCell>{booking.checkOut}</TableCell>
              <TableCell>{booking.totalPrise}</TableCell>
              <TableCell>{booking.client}</TableCell>
              <TableCell>{booking.bookingsDetails}</TableCell>
              <TableCell className='text-right'>
                {booking.bookingsServices}
              </TableCell>
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
