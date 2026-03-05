"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icons/icons";
import FormEditReservation from "./editReservationForm";
import { getReservationById } from "@/app/actions/reservation/getReservationsForEdit";

interface EditReservationProps {
  reservationId: number;
  disabled?: boolean;
}

export function EditReservation({ reservationId, disabled }: EditReservationProps) {
  // Usamos 'any' o un tipo extendido porque la respuesta de getReservationById
  // incluye User y ReservationDetails
  const [reservationData, setReservationData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getReservationById(reservationId);
      setReservationData(res);
    } catch (error) {
      console.error("Error cargando reservación:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) loadData();
      }}
    >
      <DialogTrigger asChild disabled={disabled}>
        <button
          className={`flex items-center gap-2 text-sm px-2 py-1 rounded transition ${disabled
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : "hover:bg-accent hover:text-accent-foreground"
            }`}
          disabled={disabled}
          title={disabled ? "No se puede editar una reservación confirmada" : "Editar reservación"}
        >
          <Icon action="edit" className="w-4 h-4 opacity-80" />
          {disabled ? "Editar (Confirmada)" : "Editar"}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar reservación #{reservationId}</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la estancia y la información del huésped.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <p className="text-sm opacity-70 animate-pulse">
              Cargando datos...
            </p>
          </div>
        ) : reservationData ? (
          /* IMPORTANTE: 
                       Si tu formulario usa 'reservationDetails', pásale el primer detalle.
                       Si tu formulario usa 'reservation', pásale el objeto completo.
                       Basado en el último formulario que corregimos, lo ideal es pasarle
                       el detalle que contiene las fechas y la habitación:
                    */
          <FormEditReservation
            reservationDetails={
              reservationData.ReservationDetails?.[0]
                ? {
                  ...reservationData.ReservationDetails[0],
                  Reservation: reservationData, // Le adjuntamos el padre para que el form vea al User
                }
                : null
            }
          />
        ) : (
          <p className="text-sm text-red-500">
            No se pudieron cargar los datos.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
