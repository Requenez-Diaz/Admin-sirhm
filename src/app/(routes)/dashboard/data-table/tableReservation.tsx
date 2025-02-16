'use client';
import React, { useState } from "react";
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
import { EditReservation } from "../bookings/editReservation";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";
import Filter from "./filter";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteReservation } from "../bookings/deleteReservation";
import Pagination from "./pagination";

interface TableReservationProps {
  reservations: Array<{
    id: number;
    name: string;
    lastName: string;
    email: string;
    status: Status;
    guests: number;
    rooms: number;
    bedroomsType: string;
    arrivalDate: Date;
    departureDate: Date;
  }>;
}

const TableReservation: React.FC<TableReservationProps> = ({ reservations = [] }) => {
  const totalReservation = reservations.length;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Columns");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  const contadoresEstado = {
    [Status.PENDING]: 0,
    [Status.CONFIRMED]: 0,
    [Status.CANCELLED]: 0,
  };

  reservations.forEach(res => {
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

  const filteredReservations = reservations.filter(res => {
    if (selectedFilter === "Columns") {
      return true;
    }
    if (selectedFilter === "Name") {
      return res.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedFilter === "LastName") {
      return res.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedFilter === "Status") {
      return statusLabels[res.status].toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedFilter === "Email") {
      return res.email.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <AddReservation />

        <div className="bg-gray-200 rounded-lg px-4 py-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Total Reservaciones: {totalReservation}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
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

      <div className="mb-4">
        <Filter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-12 text-xs sm:text-sm">ID</TableHead>
              <TableHead className="text-xs sm:text-sm">Nombre</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Apellido</TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm">Email</TableHead>
              <TableHead className="text-xs sm:text-sm">Estado</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Huéspedes</TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Habitaciones</TableHead>
              <TableHead className="text-xs sm:text-sm">Tipo de Habitación</TableHead>
              <TableHead className="text-xs sm:text-sm">Estancia</TableHead>
              <TableHead className="text-xs sm:text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReservations.map((reservation, index) => {
              const duration = calculateDuration(
                reservation.arrivalDate.toString(),
                reservation.departureDate.toString()
              );
              const durationLabel = duration === 1 ? "noche" : "noches";

              return (
                <TableRow key={index} className="border-b">
                  <TableCell className="text-xs sm:text-sm">{index + 1}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{reservation.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{reservation.lastName}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs sm:text-sm">{reservation.email}</TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant={statusVariants[reservation.status]}>
                      {statusLabels[reservation.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{reservation.guests}</TableCell>
                  <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{reservation.rooms}</TableCell>
                  <TableCell className="text-xs sm:text-sm">{reservation.bedroomsType}</TableCell>
                  <TableCell className="text-xs sm:text-sm text-right">
                    {duration} {durationLabel}
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2 text-xs sm:text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="flex flex-col">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <ConfirmReservation reservationId={reservation.id} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <CancellReservation reservationId={reservation.id} />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <EditReservation reservationId={reservation.id} />
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <DeleteReservation reservationId={reservation.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={paginate}
      />
    </div>
  );
}

export default TableReservation;