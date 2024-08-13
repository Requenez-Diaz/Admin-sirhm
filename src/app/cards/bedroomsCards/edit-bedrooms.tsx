import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getBedroomsById } from "@/app/actions/bedrooms/getBedroomsById";
import FormEditBedrooms from "./form-edit-bedrooms";
import { Pencil } from "lucide-react";


export async function EditBedrooms({ bedroomId }: { bedroomId: number }) {
  const bedroom = await getBedroomsById(bedroomId);

  if (!bedroom) {
    return <p>Error: No se encontró la habitación</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="update">
          <Pencil size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar habitaciones</DialogTitle>
          <DialogDescription>
            Esta seguro de actualizar la información del usuario?
          </DialogDescription>
        </DialogHeader>
        <FormEditBedrooms bedroom={bedroom}/>
      </DialogContent>
    </Dialog>
  );
}
