"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { RoleTypes } from "@/bedroomstype/roleTypes";
import { User } from "@prisma/client";
import { updateUsersById } from "@/app/actions/users";
import { Save, Undo2 } from "lucide-react";

export function FormEditUsers({ user }: { user: User | null }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("userId", user?.id.toString() || "");
    await updateUsersById(formData);
    router.refresh();
  };

  if (!user) {
    return <p>Error: No se encontró el usuario</p>;
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
      <div className='grid gap-4 py-4'>
        <input type='hidden' name='userId' value={user.id} />
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='typeRole' className='text-right'>
            Role
          </label>
          <select
            id='roleName'
            name='roleName'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
          >
            {RoleTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='emil' className='text-right'>
            Email
          </label>
          <input
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
            type='email'
            id='email'
            name='email'
            required
            defaultValue={user.email}
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='username' className='text-right'>
            Editar nombre
          </label>
          <input
            type='text'
            id='username'
            name='username'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
            required
            defaultValue={user.username}
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='password' className='text-right'>
            Editar contraseña
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
            required
            defaultValue={user.password}
          />
        </div>

        <div className='flex justify-end gap-4'>
          <DialogClose asChild>
            <Button type='button' variant='success'>
              <Undo2 />
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type='submit'
              variant='ghost'
              onClick={() => {
                toast({
                  title: "Usuario actualizado",
                  description: "El usuario ha sido actualizado correctamente",
                });
              }}
            >
              <Save />
              Actualizar
            </Button>
          </DialogClose>
        </div>
      </div>
    </form>
  );
}

export default FormEditUsers;
