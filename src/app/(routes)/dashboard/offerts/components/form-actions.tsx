"use client";

import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons/icons";
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
      <Button type='button' variant='ghost' onClick={onCancel} className="flex items-center gap-2">
        <Icon action="undo" className="w-4 h-4" />
        Cancelar
      </Button>
      <Button variant={"success"} type='submit' disabled={isSubmitting} className="flex items-center gap-2">
        <Icon action="save" className="w-4 h-4" />
        {isSubmitting
          ? "Guardando..."
          : isEditing
            ? "Actualizar Oferta"
            : "Crear Oferta"}
      </Button>
    </div>
  );
}
