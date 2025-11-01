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
import Icon from "@/components/ui/icons/icons";
import * as React from "react";

export function DeleteBedrooms({ bedroomsId }: { bedroomsId: number }) {
  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>
          <Icon action='delete' />
        </Button>
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
