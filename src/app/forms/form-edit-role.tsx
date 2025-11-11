"use client";

import { Button } from "@/components/ui/button";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { updateRole } from "../actions/role";
import { RoleTypes } from "@/bedroomstype/roleTypes";

export function FormEditRole({ role }: { role: Role | null }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("roleId", role?.id.toString() || "");
    await updateRole(formData);
    router.refresh();
  };

  if (!role) {
    return <p>Error: No se encontró el rol</p>;
  }

  return (
    <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
      <div className='grid gap-4 py-4'>
        <input type='hidden' name='roleId' value={role.id} />
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='roleName' className='text-right'>
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
          <label htmlFor='descript' className='text-right'>
            Descript
          </label>
          <input
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
            type='text'
            id='descript'
            name='descript'
            required
            defaultValue={role.descript}
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
              variant='ghost'
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

export default FormEditRole;
