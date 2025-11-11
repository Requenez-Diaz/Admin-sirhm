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
import FormEditBedrooms from "./form-edit-bedrooms";
import Icon from "@/components/ui/icons/icons";

export async function EditBedrooms({ bedroomId }: { bedroomId: number }) {
  const bedroom = await getBedroomsById(bedroomId);

  if (!bedroom) {
    return <p>Error: No se encontró la habitación</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Icon action='edit' />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar habitaciones</DialogTitle>
          <DialogDescription>
            Esta seguro de actualizar la información del usuario?
          </DialogDescription>
        </DialogHeader>
        <FormEditBedrooms bedroom={bedroom} />
      </DialogContent>
    </Dialog>
  );
}
