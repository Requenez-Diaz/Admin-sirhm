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

export interface Reservation {
    id: number;
    userName: string;
    userEmail: string;
    bedroomsType: string;
    arrivalDate: Date;
    departureDate: Date;
    finalStatus: string;
    offerts?: string | null;
    createdAt: Date;
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
            <TableHead>Habitación</TableHead>
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
        <div className="overflow-x-auto border rounded-xl shadow-sm bg-card">
            <Table>
                <TableHeaders />
                <TableBody>
                    {(!data || data.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-gray-500">
                                No hay reservaciones en el historial.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.userName}</TableCell>
                                <TableCell>{r.userEmail}</TableCell>
                                <TableCell>{r.bedroomsType}</TableCell>
                                <TableCell>{r.arrivalDate.toLocaleDateString()}</TableCell>
                                <TableCell>{r.departureDate.toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={statusVariantMap[r.finalStatus.toUpperCase()] ?? "default"}
                                        capitalize
                                    >
                                        {r.finalStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>{r.offerts ?? "—"}</TableCell>
                                <TableCell>{r.createdAt.toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
