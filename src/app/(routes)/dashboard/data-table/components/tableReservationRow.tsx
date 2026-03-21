"use client";

import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ConfirmReservation } from "@/app/(routes)/dashboard/bookings/confirmReservation";
import { CancellReservation } from "@/app/(routes)/dashboard/bookings/cancelReservation";
import { EditReservation } from "@/app/(routes)/dashboard/bookings/editReservation";
import { ViewReservation } from "@/app/(routes)/dashboard/bookings/viewReservation";
import { ReservationRow } from "@/app/actions/reservation/getReservation";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";
import { statusVariants, statusLabels } from "./tableReservationHeader";

const getUTCDate = (dateString: string | Date | null) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    12,
    0,
    0,
  );
};

interface TableReservationRowProps {
  reservation: ReservationRow;
}

export function TableReservationRow({ reservation }: TableReservationRowProps) {
  const arrival = getUTCDate(reservation.arrivalDate);
  const departure = getUTCDate(reservation.departureDate);
  const duration = calculateDuration(arrival, departure);
  const durationLabel = duration === 1 ? "noche" : "noches";

  const [firstName, ...lastParts] = (reservation.userName ?? "").split(" ");
  const lastName = lastParts.join(" ");

  return (
    <TableRow
      key={reservation.id}
      className="border-border hover:bg-muted/30 transition-colors"
    >
      <TableCell className="text-xs sm:text-sm font-medium">
        {reservation.id}
      </TableCell>
      <TableCell className="text-xs sm:text-sm">{firstName || "—"}</TableCell>
      <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
        {lastName || "—"}
      </TableCell>
      <TableCell className="hidden md:table-cell text-xs sm:text-sm">
        {reservation.email ?? "—"}
      </TableCell>
      <TableCell>
        <Badge variant={statusVariants[reservation.status]}>
          {statusLabels[reservation.status]}
        </Badge>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-center">
        {reservation.guests}
      </TableCell>
      <TableCell className="hidden sm:table-cell text-center">
        {reservation.rooms}
      </TableCell>
      <TableCell className="text-xs sm:text-sm">
        {reservation.bedroomsType || "—"}
      </TableCell>
      <TableCell className="text-xs sm:text-sm text-right whitespace-nowrap">
        {duration} {durationLabel}
      </TableCell>

      <TableCell className="text-xs sm:text-sm text-right whitespace-nowrap font-mono text-muted-foreground">
        {arrival?.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) || "—"}
        {" - "}
        {departure?.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) || "—"}
      </TableCell>

      <TableCell className="text-xs sm:text-sm text-right font-medium">
        {reservation.offert ?? "N/A"}
      </TableCell>
      <TableCell className="text-xs sm:text-sm text-right font-bold text-primary">
        C$ {Math.floor(reservation.totalPrice)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Acciones de Reserva</DropdownMenuLabel>
            {reservation.status === "PENDING" && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <ConfirmReservation reservationId={reservation.id} />
              </DropdownMenuItem>
            )}
            {reservation.roomDetails.length > 1 ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Cancelar habitación
                </DropdownMenuLabel>
                {reservation.roomDetails
                  .filter((room) => room.status !== "CANCELLED")
                  .map((room) => (
                    <DropdownMenuItem
                      key={room.id}
                      asChild
                      onSelect={(e) => e.preventDefault()}
                    >
                      <CancellReservation
                        reservationId={reservation.id}
                        isInvoiced={reservation.isInvoiced}
                        detailId={room.id}
                        roomName={room.name}
                      />
                    </DropdownMenuItem>
                  ))}
              </>
            ) : (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <CancellReservation
                  reservationId={reservation.id}
                  isInvoiced={reservation.isInvoiced}
                />
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <EditReservation
                reservationId={reservation.id}
                disabled={reservation.status === "CONFIRMED"}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <ViewReservation reservationId={reservation.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
