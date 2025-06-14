'use client';
import { getReservations } from '@/app/actions/reservation';
import { OccupancyChart } from './OccupancyChart';
import { useState, useEffect } from 'react';
import { RoomTypeDistribution } from './RoomTypeDistribution';
import { ReservationStatusChart } from './ReservationStatusChart';
import { QuickStats } from './QuickStats';

interface Reservation {
    id: number;
    name: string;
    lastName: string;
    email: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    guests: number;
    rooms: number;
    bedroomsType: string;
    arrivalDate: string | Date;
    departureDate: string | Date;
}

interface Stats {
    occupancyRate: number;
    mostRequestedType: string;
    mostRequestedRate: number;
    totalReservations: number;
    pendingReservations: number;
    confirmedReservations: number;
    cancelledReservations: number;
    roomTypes: Record<string, number>;
}

export default function DashboardPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getReservations();
                setReservations(data);
            } catch (error) {
                console.error('Error loading reservations:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const calculateStats = (reservations: Reservation[]): Stats => {
        const totalRooms = 50;
        const occupiedRooms = reservations.filter(r =>
            ['CONFIRMED', 'PENDING'].includes(r.status)
        ).length;

        const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

        const roomTypes: Record<string, number> = {};
        reservations.forEach(res => {
            roomTypes[res.bedroomsType] = (roomTypes[res.bedroomsType] || 0) + 1;
        });

        const mostRequested = Object.entries(roomTypes).sort((a, b) => b[1] - a[1])[0];

        return {
            occupancyRate,
            mostRequestedType: mostRequested?.[0] || 'N/A',
            mostRequestedRate: mostRequested ? Math.round((mostRequested[1] / reservations.length) * 100) : 0,
            totalReservations: reservations.length,
            pendingReservations: reservations.filter(r => r.status === 'PENDING').length,
            confirmedReservations: reservations.filter(r => r.status === 'CONFIRMED').length,
            cancelledReservations: reservations.filter(r => r.status === 'CANCELLED').length,
            roomTypes
        };
    };

    if (loading) return <div>Cargando...</div>;
    if (reservations.length === 0) return <div>No hay datos disponibles</div>;

    const stats = calculateStats(reservations);
    const roomTypesData = Object.entries(stats.roomTypes).map(([name, value]) => ({
        name,
        value
    }));

    const reservationStatusData = [
        { name: 'Confirmadas', value: stats.confirmedReservations },
        { name: 'Pendientes', value: stats.pendingReservations },
        { name: 'Canceladas', value: stats.cancelledReservations }
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OccupancyChart occupancyRate={stats.occupancyRate} />
                <RoomTypeDistribution roomTypesData={roomTypesData} />
                <ReservationStatusChart reservationStatusData={reservationStatusData} />
                <QuickStats
                    mostRequestedType={stats.mostRequestedType}
                    mostRequestedRate={stats.mostRequestedRate}
                    totalReservations={stats.totalReservations}
                    confirmedReservations={stats.confirmedReservations}
                    pendingReservations={stats.pendingReservations}
                    cancelledReservations={stats.cancelledReservations}
                />
            </div>
        </div>
    );
}