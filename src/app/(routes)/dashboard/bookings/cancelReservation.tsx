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
}: {
  reservationId: number;
  isInvoiced?: boolean;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false); // Controlamos el estado del diálogo
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    const result = await cancelReservation(reservationId);
    setLoading(false);

    if (result.success) {
      toast({
        title: "Éxito",
        description: result.message,
      });
      setOpen(false); // Cerramos el diálogo solo si fue exitoso
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={`flex w-full items-center gap-2 text-sm px-2 py-1 rounded transition ${isInvoiced
              ? "text-gray-400 cursor-not-allowed opacity-50"
              : "hover:bg-accent hover:text-accent-foreground text-red-600"
            }`}
          disabled={isInvoiced}
          title={isInvoiced ? "No se puede cancelar una reserva ya facturada" : "Cancelar reservación"}
        >
          <Icon action="cancell" className="w-4 h-4 opacity-80" />
          {isInvoiced ? "Facturada (No cancelable)" : "Cancelar"}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancelar reservación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea cambiar el estado de la reservación #
            {reservationId}?
          </DialogDescription>
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
