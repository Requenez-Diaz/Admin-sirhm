"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, X, Trash2, MoreHorizontal } from "lucide-react";

type TestimonialStatus = "pending" | "approved" | "rejected";

interface TestimonialActionsProps {
  testimonialId: number;
  status: TestimonialStatus;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TestimonialActions({
  testimonialId,
  status,
  onApprove,
  onReject,
  onDelete,
}: TestimonialActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {status === "pending" && (
          <>
            <DropdownMenuItem
              onClick={() => onApprove(testimonialId)}
              className='text-green-600'
            >
              <Check className='mr-2 h-4 w-4' />
              Aprobar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onReject(testimonialId)}
              className='text-red-600'
            >
              <X className='mr-2 h-4 w-4' />
              Rechazar
            </DropdownMenuItem>
          </>
        )}
        {status === "approved" && (
          <DropdownMenuItem
            onClick={() => onReject(testimonialId)}
            className='text-red-600'
          >
            <X className='mr-2 h-4 w-4' />
            Rechazar
          </DropdownMenuItem>
        )}
        {status === "rejected" && (
          <DropdownMenuItem
            onClick={() => onApprove(testimonialId)}
            className='text-green-600'
          >
            <Check className='mr-2 h-4 w-4' />
            Aprobar
          </DropdownMenuItem>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              onSelect={(e) => e.preventDefault()}
              className='text-red-600'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Eliminar
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El testimonial será eliminado
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(testimonialId)}
                className='bg-red-600 hover:bg-red-700'
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
