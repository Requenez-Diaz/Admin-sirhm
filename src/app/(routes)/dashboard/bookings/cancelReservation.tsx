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
import { cancelReservation } from "@/app/actions/reservation";

export function CancellReservation({ reservationId }: { reservationId: number }) {
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await cancelReservation(reservationId);

        if (result.success) {
            toast({
                title: "Reservación cancelada.",
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
                <Button variant="destructive">
                    <Icon action='cancell'/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cancelar reservación</DialogTitle>
                    <DialogDescription>
                        ¿Está seguro de que desea cancelar la reservación?
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="reservationId" value={String(reservationId)} />

                    <DialogFooter className="flex flex-wrap justify-between pt-4 gap-4">
                        <DialogClose asChild>
                            <Button type="button" variant="success">
                                No
                            </Button>
                        </DialogClose>
                        <DialogClose asChild>
                            <Button
                                type="submit"
                                variant="destructive"
                            >
                                Si
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}