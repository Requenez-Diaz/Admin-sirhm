'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { startOfWeek, endOfWeek, getWeeksInMonth } from 'date-fns';
import { RoomTypeFilterBar } from '../RoomTypeFilterBar';
import { RoomTypeSummaryTable } from '../RoomTypeSummaryTable';
import { filterReservations, normalizeString, ROOM_TYPE_ALIASES } from '../roomHelpers';

type Reservation = {
    bedroomsType: string;
    status: string;
    rooms: number;
    guests: number;
    arrivalDate: Date | string;
};

type Props = { reservations: Reservation[] };

export default function RoomTypeTable({ reservations }: Props) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const [filterType, setFilterType] = useState<'month' | 'week' | 'day' | 'today'>('month');
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth());
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
    const [selectedDay, setSelectedDay] = useState(currentDate.getDate());

    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: i,
        label: new Date(currentYear, i, 1).toLocaleString('es-ES', { month: 'long' }),
    }));

    const weeksInSelectedMonth = getWeeksInMonth(new Date(currentYear, selectedMonthIndex, 1), { weekStartsOn: 1 });
    const weekOptions = Array.from({ length: weeksInSelectedMonth }, (_, i) => {
        const start = startOfWeek(new Date(currentYear, selectedMonthIndex, 1 + i * 7), { weekStartsOn: 1 });
        const end = endOfWeek(start, { weekStartsOn: 1 });
        return { value: i, label: `${start.toLocaleDateString('es-ES')} - ${end.toLocaleDateString('es-ES')}` };
    });

    const filteredReservations = useMemo(
        () =>
            filterReservations(reservations, filterType, currentDate, selectedMonthIndex, selectedWeekIndex, selectedDay, currentYear),
        [reservations, filterType, selectedMonthIndex, selectedWeekIndex, selectedDay]
    );

    const roomDetails = filteredReservations.reduce((acc, res) => {
        const normalized = normalizeString(res.bedroomsType);
        const roomTypeInfo =
            Object.entries(ROOM_TYPE_ALIASES).find(([alias]) => normalizeString(alias) === normalized)?.[1] ||
            { name: res.bedroomsType, color: '#888' };

        if (!acc[roomTypeInfo.name]) acc[roomTypeInfo.name] = { total: 0, color: roomTypeInfo.color, guests: 0 };
        acc[roomTypeInfo.name].total++;
        acc[roomTypeInfo.name].guests += res.guests || 0;
        return acc;
    }, {} as Record<string, { total: number; color: string; guests: number }>);

    const formatted = Object.entries(roomDetails).map(([type, data]) => {
        const details = data as { total: number; color: string; guests: number };
        return {
            type,
            total: details.total,
            color: details.color,
            guests: details.guests,
        };
    });


    const totalReservations = formatted.reduce((sum, room) => sum + room.total, 0);
    const totalGuests = formatted.reduce((sum, room) => sum + room.guests, 0);

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Reservaciones por Tipo de Habitación</CardTitle>
                <RoomTypeFilterBar
                    filterType={filterType}
                    selectedMonthIndex={selectedMonthIndex}
                    selectedWeekIndex={selectedWeekIndex}
                    selectedDay={selectedDay}
                    currentYear={currentYear}
                    monthOptions={monthOptions}
                    weekOptions={weekOptions}
                    setFilterType={setFilterType}
                    setSelectedMonthIndex={setSelectedMonthIndex}
                    setSelectedWeekIndex={setSelectedWeekIndex}
                    setSelectedDay={setSelectedDay}
                />
            </CardHeader>

            <CardContent>
                <RoomTypeSummaryTable
                    roomDetails={formatted}
                    totalReservations={totalReservations}
                    totalGuests={totalGuests}
                />
            </CardContent>
        </Card>
    );
}
