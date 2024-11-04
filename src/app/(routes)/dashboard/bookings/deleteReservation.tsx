'use client';

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

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { deleteReservation } from "@/app/actions/reservation";


export function DeleteReservation({ reservationId }: { reservationId: number }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        await deleteReservation(formData);
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
                    <DialogTitle>Eliminar reservación</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de que desea eliminar la reservación?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="reservationId" value={String(reservationId)} />

                    <DialogFooter className="flex justify-end gap-4">
                        <DialogClose asChild>
                            <Button type="button" variant="success">
                                <Icon action='undo' className="mr-2" />
                                Cancelar
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                variant="destructive"
                                onClick={() => {
                                    toast({
                                        title: "Reservación eliminada.",
                                        description: "La reservación se ha eliminado correctamente.",
                                    });
                                }}
                            >
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
