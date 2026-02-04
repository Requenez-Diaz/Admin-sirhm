"use client"; // Asegúrate de tener esto arriba

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

// Definimos el tipo para la habitación con sus imágenes
type BedroomsWithImages = Bedrooms & {
  galleryImages: BedroomImages[];
};

interface EditBedroomsProps {
  bedroom: BedroomsWithImages;
  seasons: Seasons[];
}

export function EditBedrooms({ bedroom, seasons }: EditBedroomsProps) {
  if (!bedroom) {
    return <p>Error: No se encontró la habitación</p>;
  }

  return (
    <Dialog>
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
        {/* Pasamos los datos directamente al formulario */}
        <FormEditBedrooms bedroom={bedroom} seasons={seasons} />
      </DialogContent>
    </Dialog>
  );
}
