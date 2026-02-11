"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Icon from "@/components/ui/icons/icons";
import { FormEditBedrooms } from "./form-edit-bedrooms";
import { Seasons, Bedrooms, BedroomImages } from "@prisma/client";
import { useState } from "react";

type BedroomsWithImages = Bedrooms & {
  galleryImages: BedroomImages[];
};

interface EditBedroomsProps {
  bedroom: BedroomsWithImages;
  seasons: Seasons[];
}

export function EditBedrooms({ bedroom, seasons }: EditBedroomsProps) {
  const [open, setOpen] = useState(false);
  if (!bedroom) {
    return <p>Error: No se encontró la habitación</p>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition'>
          <Icon action='edit' className='w-4 h-4 opacity-80' />
          Editar
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar habitaciones</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de actualizar la información de la habitación?
          </DialogDescription>
        </DialogHeader>
        <FormEditBedrooms
          bedroom={bedroom}
          seasons={seasons}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
