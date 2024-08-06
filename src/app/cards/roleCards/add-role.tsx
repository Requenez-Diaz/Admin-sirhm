import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormrRole from "@/app/forms/add-role";

export function AddRoles() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='success'>Agregar</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Agregar habitación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea agregar esta habitación?
          </DialogDescription>
        </DialogHeader>
        <FormrRole />
      </DialogContent>
    </Dialog>
  );
}
