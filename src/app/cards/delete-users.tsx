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

export function DeleteUsers() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Eliminar Usuario</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
          <DialogDescription>
            Esta seguro de eliminar el usuario?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='destructive'>Cancelar</Button>
          <Button type='submit' variant={"success"}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
