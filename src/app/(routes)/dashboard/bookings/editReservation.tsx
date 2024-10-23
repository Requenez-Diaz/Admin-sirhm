import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import FormEditReservation from './editReservationForm';
import { getReservationById } from '@/app/actions/reservation/getReservationById';
import Icon from '@/components/ui/icons/icons';


export async function EditReservation({ reservationId }: { reservationId: number }) {
    const reservation = await getReservationById(reservationId);

    if (!reservation) {
        return <p>Error: No se encontró la reservación</p>
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="update">
                    <Icon action='edit' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Editar reservación</DialogTitle>
                    <DialogDescription>
                        Completa la información para editar su reservación.
                    </DialogDescription>
                </DialogHeader>
                <FormEditReservation reservation={reservation} />
            </DialogContent>
        </Dialog>
    );
}
