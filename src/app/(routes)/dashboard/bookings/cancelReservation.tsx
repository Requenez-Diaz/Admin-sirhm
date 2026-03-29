"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { cancelReservation } from "@/app/actions/reservation";
import { useState } from "react";

export function CancellReservation({
  reservationId,
  isInvoiced,
  detailId,
  roomName,
}: {
  reservationId: number;
  isInvoiced?: boolean;
  detailId?: number;
  roomName?: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const result = await cancelReservation(reservationId, detailId);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      });
      setOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const isPartialCancellation = detailId !== undefined;
  const buttonLabel = isPartialCancellation
    ? `Cancelar habitación`
    : "Cancelar";
  const dialogTitle = isPartialCancellation
    ? "Cancelar habitación específica"
    : "Cancelar reservación";
  const dialogDescription = isPartialCancellation
    ? `¿Está seguro de que desea cancelar la habitación "${roomName}" de la reservación #${reservationId}?`
    : `¿Está seguro de que desea cambiar el estado de la reservación #${reservationId}?`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`flex w-full items-center gap-2 text-sm px-2 py-1 rounded transition ${
            isInvoiced
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : isPartialCancellation
                ? "hover:bg-accent hover:text-accent-foreground text-red-600"
                : "hover:bg-accent hover:text-accent-foreground text-red-600"
          }`}
          disabled={isInvoiced}
          title={
            isInvoiced
              ? "No se puede cancelar una reserva ya facturada"
              : buttonLabel
          }
        >
          <Icon action="cancell" className="w-4 h-4 opacity-80" />
          {isInvoiced ? "Facturada (No cancelable)" : buttonLabel}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end pt-4 gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={loading}>
              No
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || isInvoiced}
          >
            {loading ? "Procesando..." : "Si, confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
