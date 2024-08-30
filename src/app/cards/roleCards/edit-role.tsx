import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getRoleById } from "@/app/actions/role";
import FormEditRole from "@/app/forms/form-edit-role";

export async function EditRole({ roleId }: { roleId: number }) {
  const role = await getRoleById(roleId);

  if (!role) {
    return <p>Error: No se encontró el Rol</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='update'>
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
            className='lucide lucide-pencil'
          >
            <path d='M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z' />
            <path d='m15 5 4 4' />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Editar rol</DialogTitle>
          <DialogDescription>
            Esta seguro de actualizar el nombre del rol?
          </DialogDescription>
        </DialogHeader>
        <FormEditRole role={role} />
      </DialogContent>
    </Dialog>
  );
}
