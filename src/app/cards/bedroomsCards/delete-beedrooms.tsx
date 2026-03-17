"use client";

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
import { deleteBedrooms } from "@/app/actions/bedrooms/deleteBedrooms";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import * as React from "react";
import { Trash } from "lucide-react";

export function DeleteBedrooms({ bedroomsId }: { bedroomsId: number }) {
  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition'>
          <Trash className='w-4 h-4 opacity-80' />
          Eliminar
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Eliminar habitación</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar la habitación?
          </DialogDescription>
        </DialogHeader>

        <form
          action={async (formData) => {
            await deleteBedrooms(formData);
            toast({
              title: "Habitación eliminada.",
              description: "La habitación se ha eliminado correctamente.",
            });
          }}
        >
          <input type='hidden' name='bedroomsId' value={String(bedroomsId)} />
          <DialogFooter className='flex justify-end gap-4'>
            <DialogClose asChild>
              <Button type='button' variant='success'>
                Cancelar
              </Button>
            </DialogClose>

            <DialogClose asChild>
              <Button type='submit' variant='destructive'>
                Eliminar
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
