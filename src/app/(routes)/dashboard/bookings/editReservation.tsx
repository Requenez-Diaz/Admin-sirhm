'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icons/icons';
import FormEditReservation from './editReservationForm';
import { getReservationById } from '@/app/actions/reservation';
import { Status } from "@prisma/client";

interface Reservation {
    id: number;
    name: string;
    lastName: string;
    email: string;
    bedroomsType: string;
    guests: number;
    rooms: number;
    arrivalDate: Date;
    departureDate: Date;
    createdAt: Date;
    updatedAt: Date;
    status: Status;
    userId: number;
    promotionId: number | null;
    isRead: boolean;
}

interface EditReservationProps {
    reservationId: number;
}

export function EditReservation({ reservationId }: EditReservationProps) {
    const [reservation, setReservation] = useState<Reservation | null>(null);

    useEffect(() => {
        async function fetchReservation() {
            const res = await getReservationById(reservationId);
            setReservation(res);
        }
        fetchReservation();
    }, [reservationId]);

    if (!reservation) {
        return <p>Cargando...</p>;
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline">
                    <Icon action='edit' className="mr-2" />
                    Editar Reservación
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