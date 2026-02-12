"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
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
  arrivalDate: string | null;
  departureDate: string | null;
  offerts?: string | null;
  status: Status;
  promotionId: number | null;
  isRead: boolean;
  imageUrl?: string | null;
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

  const formatDate = (date: string | null | Date | undefined) => {
    if (!date) return "—";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const statusVariant =
    reservation?.status === "CONFIRMED"
      ? "success"
      : reservation?.status === "CANCELLED"
        ? "destructive"
        : "info";

  const nights = reservation
    ? calculateDuration(reservation.arrivalDate, reservation.departureDate)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent transition">
          <Icon action="view" className="w-4 h-4 opacity-80" />
          Ver detalles
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-gray-50 dark:bg-slate-950">

        <div className="px-6 pt-6 pb-4 bg-white dark:bg-slate-900 border-b dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles de la reserva
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reserva #{reservation?.id}
              </p>
            </div>

            <Badge variant={statusVariant as any}>
              {reservation?.status}
            </Badge>
          </div>
        </div>

        {loading || !reservation ? (
          <div className="p-10 text-center text-gray-400">
            Cargando datos...
          </div>
        ) : (
          <div className="p-6 space-y-6">


            <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-semibold text-base mb-4 dark:text-gray-200">
                Información del huésped
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Nombre</p>
                  <p className="font-medium dark:text-gray-200">
                    {reservation.name} {reservation.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium break-all dark:text-gray-200">
                    {reservation.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 dark:text-gray-200">
                {reservation.bedroomsType}
              </h3>

              <div className="flex flex-col sm:flex-row gap-6">
                {reservation.imageUrl && (
                  <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={reservation.imageUrl}
                      alt="Imagen de la habitación"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">Check-in:</span>
                    <span className="font-medium dark:text-gray-200 text-right">{formatDate(reservation.arrivalDate)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">Check-out:</span>
                    <span className="font-medium dark:text-gray-200 text-right">{formatDate(reservation.departureDate)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Noches:</span>
                    <Badge variant="secondary" className="font-normal text-xs">{nights} noche(s)</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Huéspedes:</span>
                    <span className="font-medium dark:text-gray-200">{reservation.guests}</span>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-800 mt-4 pt-4 flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="text-xl font-bold text-orange-600">C$600</span>
              </div>
            </div>

            <DialogClose asChild>
              <Button variant="outline" className="w-full rounded-xl">
                Cerrar
              </Button>
            </DialogClose>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
