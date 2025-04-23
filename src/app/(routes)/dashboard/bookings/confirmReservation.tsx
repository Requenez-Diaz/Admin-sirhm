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
import { confirmReservation } from "@/app/actions/reservation";

export function ConfirmReservation({ reservationId }: { reservationId: number }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await confirmReservation(reservationId);

        if (result.success) {
            toast({
                title: "Reservación confirmada.",
                description: result.message,
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon action='accept' className="mr-2" />
                    Confirmar Reservación
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirmar reservación</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de que desea acceptar la reservación?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="reservationId" value={String(reservationId)} />

                    <DialogFooter className="flex flex-wrap justify-between pt-4 gap-4">
                        <DialogClose asChild>
                            <Button type="button" variant="success">
                                <Icon action='undo' className="mr-2" />
                                Cancelar
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                variant="update"
                            >
                                <Icon action='accept' className="mr-2" />
                                Acceptar
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}