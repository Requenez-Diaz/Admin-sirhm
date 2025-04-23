"use client";

import { Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Promotion } from "../type";

interface OfferActionsMenuProps {
  offer: Promotion;
  onView: (offer: Promotion) => void;
  onEdit: (offer: Promotion) => void;
  onDelete: (offer: Promotion) => void;
}

export function OfferActionsMenu({
  offer,
  onView,
  onEdit,
  onDelete,
}: OfferActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <span className='sr-only'>Abrir menú</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4'
          >
            <circle cx='12' cy='12' r='1' />
            <circle cx='12' cy='5' r='1' />
            <circle cx='12' cy='19' r='1' />
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView(offer)}>
          <Eye className='h-4 w-4 mr-2' /> Ver detalles
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(offer)}>
          <Edit className='h-4 w-4 mr-2' /> Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive'
          onClick={() => onDelete(offer)}
        >
          <Trash2 className='h-4 w-4 mr-2' /> Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
