"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deleteUsers } from "@/app/actions/users";
import { useState } from "react";
import { Pencil } from "lucide-react";
import { FormEditUsers } from "@/app/forms/users/formEditUsers";
import { getUserById } from "@/app/actions/users";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";

interface UserActionsProps {
  userId: number;
}

export function EditUserButton({ userId }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleOpen = async () => {
    const data = await getUserById(userId);
    setUser(data);
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleOpen();
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
      </DialogTrigger>
      {user && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Esta seguro de actualizar los datos del usuario?
            </DialogDescription>
          </DialogHeader>
          <FormEditUsers user={user} />
        </DialogContent>
      )}
    </Dialog>
  );
}

export function DeleteUserButton({ userId }: UserActionsProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", String(userId));
    await deleteUsers(formData);
    toast({
      title: "Usuario eliminado",
      description: "Usuario eliminado correctamente.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2 mr-2 h-4 w-4"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          Eliminar
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar usuario</DialogTitle>
          <DialogDescription>
            ¿Está seguro de que desea eliminar el usuario?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleSubmit}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserActions({ userId }: UserActionsProps) {
  return (
    <>
      <EditUserButton userId={userId} />
      <DeleteUserButton userId={userId} />
    </>
  );
}
