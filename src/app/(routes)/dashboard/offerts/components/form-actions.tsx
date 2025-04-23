"use client";

import { Button } from "@/components/ui/button";

type FormActionsProps = {
  onCancel?: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
};

export function FormActions({
  onCancel,
  isSubmitting,
  isEditing,
}: FormActionsProps) {
  return (
    <div className='flex justify-end gap-3'>
      <Button type='button' variant='danger' onClick={onCancel}>
        Cancelar
      </Button>
      <Button variant={"success"} type='submit' disabled={isSubmitting}>
        {isSubmitting
          ? "Guardando..."
          : isEditing
            ? "Actualizar Oferta"
            : "Crear Oferta"}
      </Button>
    </div>
  );
}
