"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons/icons";
import { getReservationById } from "@/app/actions/reservation";
import { Badge } from "@/components/ui/badge";
import { Status } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ReceiptText } from "lucide-react";
import { ConfirmReservation } from "./confirmReservation";

interface RoomDetail {
  id: number;
  name: string;
  description: string;
  capacity: number;
  price: number;
  image: string | null;
  nights: number;
  subtotal: number;
  seasonName?: string;
}

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
  roomDetails: RoomDetail[];
  totalAmount: number;
  isInvoiced: boolean;
  userId: number;
}

interface ViewReservationProps {
  reservationId: number;
}

export function ViewReservation({ reservationId }: ViewReservationProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchReservation();
  }, [open, reservationId]);

  const fetchReservation = async (silent = false) => {
    if (!silent) setLoading(true);
    const res = await getReservationById(reservationId);
    setReservation(res as any);
    if (!silent) setLoading(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent transition">
          <Icon action="view" className="w-4 h-4 opacity-80" />
          Ver detalles
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-gray-50 dark:bg-slate-950">

        <DialogHeader className="px-6 pt-6 pb-4 bg-white dark:bg-slate-900 border-b dark:border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Detalles de la reserva
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reserva #{reservation?.id}
              </p>
            </div>

            <Badge variant={statusVariant as any}>
              {reservation?.status}
            </Badge>
          </div>
        </DialogHeader>

        {loading || !reservation ? (
          <div className="p-10 text-center text-gray-400">
            Cargando datos...
          </div>
        ) : (
          <div className="p-6 space-y-6">

            <div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-gray-800 p-5 shadow-sm">
              <h3 className="font-semibold text-base mb-4 dark:text-gray-200">
                Información del cliente
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Nombre Completo</p>
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

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Habitaciones</p>
                  <p className="font-medium dark:text-gray-200">
                    {reservation.rooms}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Total Huéspedes</p>
                  <p className="font-medium dark:text-gray-200">
                    {reservation.guests}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg dark:text-gray-200 px-1">
                Habitaciones Reservadas
              </h3>

              {reservation.roomDetails?.length > 0 ? (
                reservation.roomDetails.map((room, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900 rounded-xl border dark:border-gray-800 p-5 shadow-sm flex flex-col sm:flex-row gap-6">

                    <div className="relative w-full sm:w-40 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {room.image ? (
                        <Image src={room.image} alt={room.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Icon action="view" className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 text-sm">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base dark:text-gray-100">{room.name}</h4>
                        <Badge variant="secondary" className="font-normal text-xs">
                          {room.nights} noche(s)
                        </Badge>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-xs">
                        {room.description}
                      </p>

                      <div className="grid grid-cols-2 gap-y-1 gap-x-4 mt-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Capacidad:</span>
                          <span className="font-medium dark:text-gray-200">{room.capacity} pers.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Precio/noche:</span>
                          <span className="font-medium dark:text-gray-200">C${room.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Temporada:</span>
                          <Badge variant="outline" className={`font-medium ${room.seasonName === "ALTA" ? "text-orange-600 border-orange-200 bg-orange-50" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                            {room.seasonName === "ALTA" ? "Alta" : "Baja"}
                          </Badge>
                        </div>
                      </div>

                      <div className="border-t dark:border-gray-800 mt-3 pt-2 flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal:</span>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                          C${room.subtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No hay detalles de habitaciones disponibles.
                </div>
              )}
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30 p-5 flex justify-between items-center">
              <span className="text-orange-800 dark:text-orange-400 font-semibold text-lg">Total Final</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                C${reservation.totalAmount?.toLocaleString() ?? 0}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-slate-950/50 p-4 rounded-lg border dark:border-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Llegada:</span>
                <span className="font-medium dark:text-gray-200">
                  {formatDate(reservation.arrivalDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Salida:</span>
                <span className="font-medium dark:text-gray-200">
                  {formatDate(reservation.departureDate)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {reservation.status === "PENDING" && (
                <ConfirmReservation
                  reservationId={reservation.id}
                  onSuccess={() => fetchReservation(true)}
                  className="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-10 py-6"
                />
              )}

              {reservation.status === "CONFIRMED" && !reservation.isInvoiced && (
                <Button
                  onClick={() => {
                    setOpen(false);
                    router.push(`/dashboard/invoices/new?reservationId=${reservation.id}`);
                  }}
                  className="flex-1 rounded-xl py-6 text-base bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
                >
                  <ReceiptText className="w-5 h-5" /> Generar Factura
                </Button>
              )}

              {reservation.isInvoiced && (
                <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl py-4 px-2 text-sm text-gray-500 font-medium">
                  <ReceiptText className="w-4 h-4 mr-2" /> Reservación ya facturada
                </div>
              )}

              <DialogClose asChild>
                <Button variant="outline" className={`rounded-xl py-6 text-base ${reservation.status === "PENDING" || (reservation.status === "CONFIRMED" && !reservation.isInvoiced)
                    ? "flex-1" : "w-full"
                  }`}>
                  Cerrar Detalles
                </Button>
              </DialogClose>
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
