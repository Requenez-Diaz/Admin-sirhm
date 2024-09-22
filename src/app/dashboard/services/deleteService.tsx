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
import { deleteService } from "@/app/actions/services";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";

export function DeleteService({ serviceId }: { serviceId: string }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await deleteService(formData);

        if (response.success) {
            toast({
                title: "Servicio eliminado.",
                description: response.message,
            });
        } else {
            toast({
                title: "Error al eliminar el servicio.",
                description: response.message,
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <Icon action='delete' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Eliminar Servicio</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de que desea eliminar este servicio?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="serviceId" value={String(serviceId)} />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="success">
                                <Icon action='undo' className="mr-2" />
                                Cancelar
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button type="submit" variant="destructive">
                                <Icon action='delete' className="mr-2" />
                                Eliminar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteService;