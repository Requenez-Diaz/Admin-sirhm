'use client';

import { deleteBedrooms } from "@/app/actions/bedrooms/deleteBedrooms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Undo2 } from "lucide-react";

export function DeleteBedrooms({ bedroomsId }: { bedroomsId: number }) {
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await deleteBedrooms(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar habitación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar la habitación?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="bedroomsId" value={String(bedroomsId)} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="success">
                <Undo2 className="mr-2" />
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="submit"
                variant="destructive"
                onClick={() => {
                  toast({
                    title: "Habitación eliminada.",
                    description: "La habitación se ha eliminado correctamente.",
                  });
                }}
              >
                <Trash2 className="mr-2" />
                Eliminar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
