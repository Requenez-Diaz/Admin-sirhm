import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FormReservation } from './formReservation';
import Icon from '@/components/ui/icons/icons';

export function AddReservation() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='success'>
                    <Icon action='plus' className="mr-2" />
                    Agregar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Selecciona tu habitación</DialogTitle>
                    <DialogDescription>
                        Completa la información para reservar tu habitación.
                    </DialogDescription>
                </DialogHeader>
                <FormReservation />
            </DialogContent>
        </Dialog>
    );
}
