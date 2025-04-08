"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormValues, Promotion } from "../../type";
import { EditOfferForm } from "./edit-offerts-forms";

interface EditOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Promotion | null;
  onSubmit: (values: FormValues) => Promise<void>;
}

export function EditOfferDialog({
  open,
  onOpenChange,
  offer,
  onSubmit,
}: EditOfferDialogProps) {
  return offer ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Editar Oferta</DialogTitle>
        </DialogHeader>
        <EditOfferForm
          offer={offer}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  ) : null;
}
