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
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function AddReservation() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setOpen(true);
        }
    }, [searchParams]);

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen && searchParams.get('action') === 'new') {
            // Remove the query parameters when closing the modal so it doesn't reopen on refresh
            router.replace('/dashboard/bookings', { scroll: false });
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
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
                <FormReservation onSubmitSuccess={() => handleOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
