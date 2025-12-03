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
    createdAt: Date;
    isRead: boolean;
    user_id: number;
    status: Status;
    User: {
        id: number;
        email: string;
        username: string;
        image: string | null;
    };
    ReservationDetails: Array<{
        id: number;
        reservation_id: number;
        price: number;
        dateStart: Date;
        dateEnd: Date;
        promotion_id: number | null;
        status: Status;
        created_at: Date;
        bedrooms_id: number;
        guestQuantity: number;
        Bedrooms: {
            id: number;
            typeBedroom: string;
            capacity: number;
            lowSeasonPrice: number;
            highSeasonPrice: number;
        };
        Promotions: {
            id: number;
            codePromotions: string;
            porcentageDescuent: number;
        } | null;
    }>;
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
