import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteBedrooms() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Eliminar habitacion</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Eliminar habitacion</DialogTitle>
          <DialogDescription>
            Esta seguro de eliminar la habitacion?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='success'>Cancelar</Button>
          <Button type='submit' variant={"destructive"}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
