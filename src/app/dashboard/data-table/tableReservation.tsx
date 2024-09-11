import prisma from "@/lib/db";
import React from "react";
import { Status } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddReservation } from "../bookings/addReservation";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { EditReservation } from "../bookings/editReservation";
import { DeleteReservation } from "../bookings/deleteReservation";

async function TableReservation() {
  const reservation = await prisma.reservation.findMany({});

  const totalReservation = reservation.length;

  const statusVariants: Record<string, BadgeProps["variant"]> = {
    [Status.PENDING]: "info",
    [Status.CONFIRMED]: "success",
    [Status.CANCELLED]: "destructive",
  };

  const statusLabels: Record<string, string> = {
    [Status.PENDING]: "Pendiente",
    [Status.CONFIRMED]: "Confirmado",
    [Status.CANCELLED]: "Cancelado",
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start mb-4 items-center">
        <AddReservation />
        <h2 className="text-xl font-semibold ml-4">Total Reservaciones: {totalReservation}</h2>
      </div>

      <form>
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[100px]">Nombre</TableHead>
              <TableHead className="w-[100px]">Apellido</TableHead>
              <TableHead className="w-[100px]">Email</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[100px]">Huespedes</TableHead>
              <TableHead className="w-[50px]">Habitaciones</TableHead>
              <TableHead className="w-[100px]">Tipo de habitación</TableHead>
              <TableHead className="w-[100px]">Estancia</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservation.map((reservation, index) => {
              const duration = calculateDuration(
                reservation.arrivalDate.toString(),
                reservation.departureDate.toString()
              );
              const durationLabel = duration === 1 ? "noche" : "noches";
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{reservation.name}</TableCell>
                  <TableCell>{reservation.lastName}</TableCell>
                  <TableCell>{reservation.email}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[reservation.status]}>
                      {statusLabels[reservation.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{reservation.guests}</TableCell>
                  <TableCell>{reservation.rooms}</TableCell>
                  <TableCell>{reservation.bedroomsType}</TableCell>
                  <TableCell className="text-right">
                    {duration} {durationLabel}
                  </TableCell>
                  <TableCell className="flex justify-between gap-3">
                    <EditReservation reservationId={reservation.id} />
                    <DeleteReservation reservationId={reservation.id} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </form>
    </div>
  );
}

// Función para calcular la duración de la estancia
const calculateDuration = (arrivalDate: string, departureDate: string): number => {
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  const duration = (departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24); // Convert milliseconds to days
  return Math.round(duration);
};

export default TableReservation;