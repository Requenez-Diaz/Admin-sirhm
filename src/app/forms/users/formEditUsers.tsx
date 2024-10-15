"use client";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { RoleTypes } from "@/bedroomstype/roleTypes";
import { User } from "@prisma/client";
import { updateUsersById } from "@/app/actions/users";

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
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-undo-2 mr-2'
              >
                <path d='M9 14L4 9l5-5' />
                <path d='M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11' />
              </svg>
              Cancelar
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              type='submit'
              variant='update'
              onClick={() => {
                toast({
                  title: "Habitación actualizada.",
                  description: "La habitación se actualizo correctamente.",
                });
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='lucide lucide-save-all mr-2'
              >
                <path d='M10 2v3a1 1 0 0 0 1 1h5' />
                <path d='M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6' />
                <path d='M18 22H4a2 2 0 0 1-2-2V6' />
                <path d='M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z' />
              </svg>
              Actualizar
            </Button>
          </DialogClose>
        </div>
      </div>
    </form>
  );
}

export default FormEditUsers;
