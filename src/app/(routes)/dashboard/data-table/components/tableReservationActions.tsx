"use client";

import Filter from "../filter";
import { TableReservationHeader } from "./tableReservationHeader";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

interface TableReservationActionsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  counters: Record<BookingStatus, number>;
}

export function TableReservationActions({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  counters,
}: TableReservationActionsProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6 bg-muted/10 p-4 rounded-xl border border-border">
      <div className="flex-1">
        <Filter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </div>

      <TableReservationHeader counters={counters} />
    </div>
  );
}
