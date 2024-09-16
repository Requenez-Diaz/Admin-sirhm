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
import { ConfirmReservation } from "../bookings/confirmReservation";
import { CancellReservation } from "../bookings/cancelReservation";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";

async function TableReservation() {
  const reservation = await prisma.reservation.findMany({});

  const totalReservation = reservation.length;

  const contadoresEstado = {
    [Status.PENDING]: 0,
    [Status.CONFIRMED]: 0,
    [Status.CANCELLED]: 0,
  };

  reservation.forEach(res => {
    contadoresEstado[res.status]++;
  });

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
      <div className="flex items-center mb-4">

        <div className="flex items-center">
          <AddReservation />
        </div>

        <div className="bg-gray-200 rounded-lg px-4 py-2 mx-2">
          <h2 className="text-xl font-semibold text-gray-800">Total Reservaciones: {totalReservation}</h2>
        </div>

        <div className="flex items-center px-4 py-2 mx-2">
          <h3 className="text-lg font-semibold text-gray-800 mr-4">Total por Estado:</h3>
          <div className="flex space-x-2">
            <Badge variant={statusVariants[Status.PENDING]}>
              {statusLabels[Status.PENDING]}: {contadoresEstado[Status.PENDING]}
            </Badge>
            <Badge variant={statusVariants[Status.CONFIRMED]}>
              {statusLabels[Status.CONFIRMED]}: {contadoresEstado[Status.CONFIRMED]}
            </Badge>
            <Badge variant={statusVariants[Status.CANCELLED]}>
              {statusLabels[Status.CANCELLED]}: {contadoresEstado[Status.CANCELLED]}
            </Badge>
          </div>
        </div>
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
              <TableHead className="w-[100px]">Huéspedes</TableHead>
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
                    <ConfirmReservation reservationId={reservation.id} />
                    <CancellReservation reservationId={reservation.id} />
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

export default TableReservation;