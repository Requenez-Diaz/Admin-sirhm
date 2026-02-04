"use client";
import React, { useState } from "react";
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
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "./pagination";
import { ViewReservation } from "../bookings/viewReservation";
import { ReservationRow } from "@/app/actions/reservation/getReservation";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface TableReservationProps {
  reservations: ReservationRow[];
}

const TableReservation: React.FC<TableReservationProps> = ({
  reservations = [],
}) => {
  const totalReservation = reservations.length;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  // Mapeo de estados y estilos
  const statusVariants: Record<BookingStatus, BadgeProps["variant"]> = {
    PENDING: "info",
    CONFIRMED: "success",
    CANCELLED: "destructive",
  };

  const statusLabels: Record<BookingStatus, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
  };

  // 1. LÓGICA DE FILTRADO UNIFICADA
  const filteredReservations = reservations.filter((res) => {
    const term = searchTerm.toLowerCase();
    const userName = (res.userName ?? "").toLowerCase();
    const email = (res.email ?? "").toLowerCase();
    const statusLabel = statusLabels[res.status];

    // Filtro por Estado (Dropdown)
    const matchesStatus =
      selectedFilter === "Todo" || statusLabel === selectedFilter;

    const matchesSearch = userName.includes(term) || email.includes(term);

    return matchesStatus && matchesSearch;
  });

  // 2. CONTADORES (Basados en la data original para los badges superiores)
  const contadoresEstado: Record<BookingStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
  };

  reservations.forEach((res) => {
    contadoresEstado[res.status]++;
  });

  // 3. PAGINACIÓN
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstReservation,
    indexOfLastReservation,
  );

  const totalPages = Math.ceil(
    filteredReservations.length / reservationsPerPage,
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className='overflow-x-auto p-4'>
      <div className='flex flex-col sm:flex-row sm:items-center gap-4 mb-4'>
        <AddReservation />

        <div className='bg-gray-200 rounded-lg px-4 py-2'>
          <h2 className='text-base sm:text-lg font-semibold text-gray-800'>
            Total Reservaciones: {totalReservation}
          </h2>
        </div>

        <div className='grid grid-cols-2 sm:flex sm:items-center gap-2'>
          <Badge variant={statusVariants.PENDING}>
            {statusLabels.PENDING}: {contadoresEstado.PENDING}
          </Badge>
          <Badge variant={statusVariants.CONFIRMED}>
            {statusLabels.CONFIRMED}: {contadoresEstado.CONFIRMED}
          </Badge>
          <Badge variant={statusVariants.CANCELLED}>
            {statusLabels.CANCELLED}: {contadoresEstado.CANCELLED}
          </Badge>
        </div>
      </div>

      <div className='mb-4'>
        <Filter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={(filter) => {
            setSelectedFilter(filter);
            setCurrentPage(1); // Resetear a pag 1 al filtrar
          }}
        />
      </div>

      <div className='overflow-x-auto'>
        <Table className='min-w-full border border-gray-200'>
          <TableHeader>
            <TableRow className='bg-gray-100'>
              <TableHead className='w-12 text-xs sm:text-sm'>ID</TableHead>
              <TableHead className='text-xs sm:text-sm'>Nombre</TableHead>
              <TableHead className='hidden sm:table-cell text-xs sm:text-sm'>
                Apellido
              </TableHead>
              <TableHead className='hidden md:table-cell text-xs sm:text-sm'>
                Email
              </TableHead>
              <TableHead className='text-xs sm:text-sm'>Estado</TableHead>
              <TableHead className='hidden sm:table-cell text-xs sm:text-sm text-center'>
                Huéspedes
              </TableHead>
              <TableHead className='hidden sm:table-cell text-xs sm:text-sm text-center'>
                Habitaciones
              </TableHead>
              <TableHead className='text-xs sm:text-sm'>
                Tipo de Habitación
              </TableHead>
              <TableHead className='text-xs sm:text-sm'>Estancia</TableHead>
              <TableHead className='text-xs sm:text-sm'>
                Llegada - Salida
              </TableHead>
              <TableHead className='text-xs sm:text-sm'>Ofertas</TableHead>
              <TableHead className='text-xs sm:text-sm'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReservations.length > 0 ? (
              currentReservations.map((reservation) => {
                const arrival = reservation.arrivalDate
                  ? new Date(reservation.arrivalDate)
                  : null;
                const departure = reservation.departureDate
                  ? new Date(reservation.departureDate)
                  : null;
                const duration = calculateDuration(arrival, departure);
                const durationLabel = duration === 1 ? "noche" : "noches";

                // Dividir nombre para mostrar en columnas separadas
                const [firstName, ...lastParts] = (
                  reservation.userName ?? ""
                ).split(" ");
                const lastName = lastParts.join(" ");

                return (
                  <TableRow key={reservation.id} className='border-b'>
                    <TableCell className='text-xs sm:text-sm'>
                      {reservation.id}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm'>
                      {firstName || "—"}
                    </TableCell>
                    <TableCell className='hidden sm:table-cell text-xs sm:text-sm'>
                      {lastName || "—"}
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-xs sm:text-sm'>
                      {reservation.email ?? "—"}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm'>
                      <Badge variant={statusVariants[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell text-xs sm:text-sm text-center'>
                      {reservation.guests}
                    </TableCell>
                    <TableCell className='hidden sm:table-cell text-xs sm:text-sm text-center'>
                      {reservation.rooms}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm'>
                      {reservation.bedroomsType || "—"}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm text-right'>
                      {duration} {durationLabel}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm text-right'>
                      {arrival?.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      }) || "—"}{" "}
                      -{" "}
                      {departure?.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      }) || "—"}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm text-right'>
                      {reservation.offerts ?? "N/A"}
                    </TableCell>
                    <TableCell className='text-xs sm:text-sm'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' className='h-8 w-8 p-0'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            asChild
                          >
                            <ConfirmReservation
                              reservationId={reservation.id}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            asChild
                          >
                            <CancellReservation
                              reservationId={reservation.id}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            asChild
                          >
                            <EditReservation reservationId={reservation.id} />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            asChild
                          >
                            <ViewReservation reservationId={reservation.id} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className='text-center py-10 text-gray-500'
                >
                  No se encontraron reservaciones que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
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
};

export default TableReservation;
