import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getServiceById } from "@/app/actions/services";
import Icon from "@/components/ui/icons/icons";
import FormEditServices from "./formEditServices";

export async function EditServices({ serviceId }: { serviceId: string }) {
  const service = await getServiceById(serviceId);

  if (!service) {
    return <p>Error: No se encontró la habitación</p>;
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Icon action='edit' />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
          <DialogDescription>
            Esta seguro de actualizar el servicio?
          </DialogDescription>
        </DialogHeader>
        <FormEditServices service={service} />
      </DialogContent>
    </Dialog>
  );
}
