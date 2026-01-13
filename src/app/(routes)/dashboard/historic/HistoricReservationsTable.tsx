"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";

export interface Reservation {
  id: number;
  userName: string;
  userEmail: string | null;
  bedroomsType: string;
  arrivalDate: string | null;
  departureDate: string | null;
  finalStatus: string;
  guests: number;
  rooms: number;
  offerts?: string | null;
  createdAt: string;
  userImage?: string | null;
}

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "info" | "success" | "pending"
> = {
  CANCELLED: "destructive",
  COMPLETED: "success",
  EXPIRED: "pending",
};

interface Props {
  data: Reservation[];
}

const TableHeaders = () => (
  <TableHeader>
    <TableRow>
      <TableHead>Cliente</TableHead>
      <TableHead>Correo</TableHead>
      <TableHead>Huéspedes</TableHead>
      <TableHead>Habitaciones</TableHead>
      <TableHead>Tipo de Habitación</TableHead>
      <TableHead>Estancia (días)</TableHead>
      <TableHead>Llegada</TableHead>
      <TableHead>Salida</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead>Promoción</TableHead>
      <TableHead>Creación</TableHead>
    </TableRow>
  </TableHeader>
);

export default function HistoricReservationsTable({ data }: Props) {
  return (
    <div className='overflow-x-auto border rounded-xl shadow-sm bg-card'>
      <Table>
        <TableHeaders />
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className='text-center text-gray-500'>
                No hay reservaciones en el historial.
              </TableCell>
            </TableRow>
          ) : (
            data.map((r) => {
              // Convierte ISO strings a Date con fallback a null
              const arrival = r.arrivalDate ? new Date(r.arrivalDate) : null;
              const departure = r.departureDate
                ? new Date(r.departureDate)
                : null;
              const created = r.createdAt ? new Date(r.createdAt) : null;

              const duration = calculateDuration(arrival, departure);

              return (
                <TableRow key={r.id}>
                  <TableCell>{r.userName}</TableCell>
                  <TableCell>{r.userEmail ?? "—"}</TableCell>
                  <TableCell>{r.guests}</TableCell>
                  <TableCell>{r.rooms}</TableCell>
                  <TableCell>{r.bedroomsType || "—"}</TableCell>

                  <TableCell>{duration}</TableCell>

                  <TableCell>
                    {arrival
                      ? arrival.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {departure
                      ? departure.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        statusVariantMap[r.finalStatus.toUpperCase()] ??
                        "default"
                      }
                      capitalize
                    >
                      {r.finalStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>{r.offerts ?? "—"}</TableCell>

                  <TableCell>
                    {created
                      ? created.toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })
                      : "—"}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
