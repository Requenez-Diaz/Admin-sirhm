"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./pagination";
import {
  TableReservationActions,
  TableReservationRow,
  TableReservationFooter,
  TableEmptyState,
  TableReservationTitle,
} from "./components";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface TableReservationProps {
  reservations: ReservationRow[];
}

interface ReservationRow {
  id: number;
  status: BookingStatus;
  userName: string;
  lastName: string;
  email: string | null;
  guests: number;
  rooms: number;
  bedroomsType: string;
  arrivalDate: string | null;
  departureDate: string | null;
  offert: string | null;
  totalPrice: number;
  isInvoiced: boolean;
  roomDetails: {
    id: number;
    name: string;
    status: BookingStatus;
    price: number;
    dateStart: string | null;
    dateEnd: string | null;
  }[];
}

const TableReservation: React.FC<TableReservationProps> = ({
  reservations = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todo");
  const [currentPage, setCurrentPage] = useState(1);
  const reservationsPerPage = 10;

  const counters: Record<BookingStatus, number> = {
    PENDING: 0,
    CONFIRMED: 0,
    CANCELLED: 0,
  };

  reservations.forEach((res) => {
    counters[res.status]++;
  });

  const filteredReservations = reservations.filter((res) => {
    const term = searchTerm.toLowerCase();
    const userName = (res.userName ?? "").toLowerCase();
    const email = (res.email ?? "").toLowerCase();
    const matchesSearch = userName.includes(term) || email.includes(term);
    const matchesStatus =
      selectedFilter === "Todo" ||
      res.status === getStatusFromLabel(selectedFilter);
    return matchesStatus && matchesSearch;
  });

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

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  return (
    <div className="overflow-x-auto p-4 space-y-6">
      <TableReservationTitle />
      <TableReservationActions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={handleFilterChange}
        counters={counters}
      />

      <div className="rounded-md border border-border overflow-hidden bg-background">
        <Table className="min-w-full">
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="w-12 text-xs sm:text-sm text-foreground font-bold">
                ID
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold">
                Nombre
              </TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm text-foreground font-bold">
                Apellido
              </TableHead>
              <TableHead className="hidden md:table-cell text-xs sm:text-sm text-foreground font-bold">
                Email
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold">
                Estado
              </TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm text-foreground font-bold text-center">
                Huéspedes
              </TableHead>
              <TableHead className="hidden sm:table-cell text-xs sm:text-sm text-foreground font-bold text-center">
                Habitaciones
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold">
                Tipo
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold">
                Estancia
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold text-right">
                Llegada - Salida
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold text-right">
                Ofertas
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold text-right">
                Total
              </TableHead>
              <TableHead className="text-xs sm:text-sm text-foreground font-bold text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReservations.length > 0 ? (
              currentReservations.map((reservation) => (
                <TableReservationRow
                  key={reservation.id}
                  reservation={reservation}
                />
              ))
            ) : (
              <TableEmptyState />
            )}
          </TableBody>
          {filteredReservations.length > 0 && (
            <TableReservationFooter totalCount={filteredReservations.length} />
          )}
        </Table>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
};

function getStatusFromLabel(label: string): BookingStatus {
  const mapping: Record<string, BookingStatus> = {
    Pendiente: "PENDING",
    Confirmado: "CONFIRMED",
    Cancelado: "CANCELLED",
  };
  return mapping[label] ?? "PENDING";
}

export default TableReservation;
