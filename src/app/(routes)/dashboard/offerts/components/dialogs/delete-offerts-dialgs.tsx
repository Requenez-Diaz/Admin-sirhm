"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Promotion } from "../../type";

interface DeleteOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Promotion | null;
  onConfirm: (id: number) => Promise<void>;
}

export function DeleteOfferDialog({
  open,
  onOpenChange,
  offer,
  onConfirm,
}: DeleteOfferDialogProps) {
  return offer ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar la oferta &ldquo;
            {offer.codePromotions}&rdquo;? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant='destructive' onClick={() => onConfirm(offer.id)}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ) : null;
}
