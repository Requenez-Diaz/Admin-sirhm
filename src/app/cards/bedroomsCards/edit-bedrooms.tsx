import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBedroomsById } from "@/app/actions/bedrooms";

import Icon from "@/components/ui/icons/icons";
import prisma from "@/lib/db";
import { FormEditBedrooms } from "./form-edit-bedrooms";

export async function EditBedrooms({ bedroomId }: { bedroomId: number }) {
  const bedroom = await getBedroomsById(bedroomId);
  const seasons = await prisma.seasons.findMany();

  if (!bedroom) {
    return <p>Error: No se encontró la habitación</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost'>
          <Icon action='edit' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar habitaciones</DialogTitle>
          <DialogDescription>
            Esta seguro de actualizar la información de la habitación?
          </DialogDescription>
        </DialogHeader>
        <FormEditBedrooms bedroom={bedroom} seasons={seasons} />
      </DialogContent>
    </Dialog>
  );
}
