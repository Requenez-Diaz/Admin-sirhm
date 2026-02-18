'use client';
import { getReservations, type ReservationRow as Reservation } from '@/app/actions/reservation';
import { getTypeBedrooms } from '@/app/actions/roomsType/rooms-type';
import { OccupancyChart } from './OccupancyChart';
import { useState, useEffect } from 'react';
import { RoomTypeDistribution } from './RoomTypeDistribution';
import { QuickStats } from './QuickStats';
import { ReservationStatusChart } from './ReservationStatusChart';

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

export function ReportDashboard() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [allRoomTypes, setAllRoomTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [reservationsData, typesResult] = await Promise.all([
                    getReservations(),
                    getTypeBedrooms()
                ]);

                setReservations(reservationsData);

                if (typesResult.success && typesResult.data) {
                    setAllRoomTypes(typesResult.data.map((t: any) => t.nameType));
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const calculateStats = (reservations: Reservation[], allTypes: string[]): Stats => {
        const totalRooms = 50;
        const occupiedRooms = reservations.filter(r =>
            ['CONFIRMED', 'PENDING'].includes(r.status)
        ).length;

        const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

        const roomTypes: Record<string, number> = {};

        allTypes.forEach(type => {
            roomTypes[type] = 0;
        });

        reservations.forEach(res => {
            const types = res.bedroomsType.split(',').map(t => t.trim());
            types.forEach(type => {
                if (type && type !== "Sin tipo") {
                    roomTypes[type] = (roomTypes[type] || 0) + 1;
                }
            });
        });

        const sortedTypes = Object.entries(roomTypes).sort((a, b) => b[1] - a[1]);
        const mostRequested = sortedTypes[0];

        return {
            occupancyRate,
            mostRequestedType: mostRequested?.[0] || 'N/A',
            mostRequestedRate: mostRequested ? Math.round((mostRequested[1] / Math.max(reservations.length, 1)) * 100) : 0,
            totalReservations: reservations.length,
            pendingReservations: reservations.filter(r => r.status === 'PENDING').length,
            confirmedReservations: reservations.filter(r => r.status === 'CONFIRMED').length,
            cancelledReservations: reservations.filter(r => r.status === 'CANCELLED').length,
            roomTypes
        };
    };

    if (loading) return <div>Cargando...</div>;
    if (reservations.length === 0) return <div>No hay datos disponibles</div>;

    const stats = calculateStats(reservations, allRoomTypes);
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

export default ReportDashboard;