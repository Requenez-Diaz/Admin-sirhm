'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
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
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const res = await getReservationById(reservationId);
        setReservation(res);
        setLoading(false);
    };

    return (
        <Dialog
            onOpenChange={(open) => {
                if (open) loadData();
            }}
        >
            <DialogTrigger asChild>
                <button
                    className="flex items-center gap-2 text-sm px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition"
                >
                    <Icon action="edit" className="w-4 h-4 opacity-80" />
                    Editar
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] p-6">
                <DialogHeader>
                    <DialogTitle>Editar reservación</DialogTitle>
                    <DialogDescription>
                        Completa la información para editar su reservación.
                    </DialogDescription>
                </DialogHeader>

                {loading && (
                    <p className="text-sm opacity-70">Cargando datos...</p>
                )}

                {!loading && reservation && (
                    <FormEditReservation reservation={reservation} />
                )}
            </DialogContent>
        </Dialog>
    );
}
