'use client';

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons/icons";
import { getReservationById } from "@/app/actions/reservation";
import { Badge } from "@/components/ui/badge";
import { Status } from "@prisma/client";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";

interface Reservation {
    id: number;
    name: string;
    lastName: string;
    email: string;
    bedroomsType: string;
    guests: number;
    rooms: number;
    arrivalDate: string | Date;
    departureDate: string | Date;
    offerts?: string | null;
    status: Status;
    promotionId: number | null;
    isRead: boolean;
}

interface ViewReservationProps {
    reservationId: number;
}

export function ViewReservation({ reservationId }: ViewReservationProps) {
    const [open, setOpen] = useState(false);
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        async function fetchReservation() {
            setLoading(true);
            const res = await getReservationById(reservationId);
            setReservation(res);
            setLoading(false);
        }

        fetchReservation();
    }, [open, reservationId]);

    const formatDate = (date: string | Date) =>
        new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    const statusVariant = reservation?.status === "CONFIRMED"
        ? "success"
        : reservation?.status === "CANCELLED"
            ? "destructive"
            : "info";

    const nights = reservation
        ? calculateDuration(
            reservation.arrivalDate.toString(),
            reservation.departureDate.toString()
        )
        : 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition"
                >
                    <Icon action="view" className="w-4 h-4 opacity-80" />
                    Ver detalles
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md w-full p-5 rounded-2xl shadow-lg bg-white border border-gray-100">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                        Detalles de la Reservación
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-gray-500 text-sm">
                        Información completa de la reservación seleccionada.
                    </DialogDescription>
                </DialogHeader>

                {loading || !reservation ? (
                    <div className="py-10 text-center text-gray-400">Cargando datos...</div>
                ) : (
                    <div className="mt-4 grid gap-3">
                        <div className="flex justify-start">
                            <Badge variant={statusVariant} className="px-3 py-1 text-sm">
                                {reservation.status}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Nombre</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">
                                    {reservation.name} {reservation.lastName}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Email</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{reservation.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Huéspedes</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{reservation.guests}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Habitaciones</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{reservation.rooms}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Tipo de Habitación</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{reservation.bedroomsType}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Noches</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{nights}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Llegada</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{formatDate(reservation.arrivalDate)}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Salida</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{formatDate(reservation.departureDate)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                <p className="text-gray-600 text-xs">Ofertas</p>
                                <p className="font-semibold text-gray-900 mt-1 text-sm">{reservation.offerts || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <DialogClose asChild>
                    <Button variant="outline" className="mt-5 w-full hover:bg-gray-100">
                        Cerrar
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
