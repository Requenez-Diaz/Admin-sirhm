import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormBedrooms from "./form-bedrooms";
import Icon from "@/components/ui/icons/icons";

export function AddBedrooms() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='success'>
          <Icon action='plus' className="mr-2" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Agregar habitación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea agregar esta habitación?
          </DialogDescription>
        </DialogHeader>
        <FormBedrooms />
      </DialogContent>
    </Dialog>
  );
}
