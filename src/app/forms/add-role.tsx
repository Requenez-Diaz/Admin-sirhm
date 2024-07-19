"use client";

import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import saveRole from "@/app/actions/role/saveRole";
import { RoleTypes } from "@/bedroomstype/roleTypes";

export function FormRole() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await saveRole(formData);
      toast({
        title: "Éxito",
        description: "El rol se ha guardado correctamente.",
      });
      formRef.current?.reset();
      return response;
    } catch (error) {
      console.error("Error al guardar el rol:", error);
      toast({
        title: "Error",
        description:
          "Ocurrió un error al guardar el rol. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='name' className='text-right'>
            Rol
          </label>
          <select
            id='name'
            name='name'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
          >
            {RoleTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* <div className='grid grid-cols-4 items-center gap-4'>
          <label htmlFor='status' className='text-right'>
            Estado
          </label>
          <select
            id='status'
            name='status'
            className='col-span-3 border border-gray-300 rounded px-2 py-1'
          >
            <option value='0'>Inactivo</option>
            <option value='1'>Activo</option>
          </select>
        </div> */}

        <div className='flex justify-end gap-4'>
          <DialogClose asChild>
            <Button type='button' variant='success' disabled={loading}>
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
          <Button type='submit' variant='update' disabled={loading}>
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
            Registrar
          </Button>
        </div>
      </div>
    </form>
  );
}

export default FormRole;
