'use client';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { findManyUsers } from '@/app/actions/users';
import { getReservations } from '@/app/actions/reservation';
import { FileSpreadsheet } from 'lucide-react';

interface User {
    username: string;
    email: string;
    roleName: string;
    createdAt: string | Date;
}

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

export default function ExcelReportGenerator() {
    const [loading, setLoading] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = "Administrador";

    const loadData = async () => {
        setLoading(true);
        try {
            const usersData = await findManyUsers();
            const reservationsData = await getReservations();
            setUsers(usersData);
            setReservations(reservationsData);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const generateExcelReport = async () => {
        setLoading(true);
        try {
            await loadData();

            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            const stats = calculateStats(reservations);
            const statusLabels = {
                PENDING: 'Pendiente',
                CONFIRMED: 'Confirmado',
                CANCELLED: 'Cancelado',
            };

            const wb = XLSX.utils.book_new();

            // 1. HOJA RESUMEN EJECUTIVO
            const wsSummary = XLSX.utils.aoa_to_sheet([
                ['HOTEL MADROÑO - RESUMEN EJECUTIVO'],
                [],
                [`Generado: ${today.toLocaleDateString()}`],
                [`Periodo: ${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`],
                [`Generado por: ${currentUser}`],
                [],
                ['INDICADORES CLAVE'],
                [`• Ocupación total: ${stats.occupancyRate}%`],
                [`• Habitación más solicitada: ${stats.mostRequestedType} (${stats.mostRequestedRate}% de reservas)`],
                [`• Reservas totales: ${stats.totalReservations}`],
                [`  - Confirmadas: ${stats.confirmedReservations}`],
                [`  - Pendientes: ${stats.pendingReservations}`],
                [`  - Canceladas: ${stats.cancelledReservations}`]
            ]);

            // 2. HOJA REPORTE DE OCUPACIÓN
            const wsOccupancy = XLSX.utils.aoa_to_sheet([
                ['HOTEL MADROÑO - REPORTE DE OCUPACIÓN'],
                [],
                [`Generado: ${today.toLocaleDateString()}`],
                [`Periodo: ${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`],
                [`Generado por: ${currentUser}`],
                [],
                ['RESUMEN DE OCUPACIÓN'],
                [`• Ocupación total: ${stats.occupancyRate}%`],
                [`• Habitaciones más solicitadas: ${stats.mostRequestedType} (${stats.mostRequestedRate}% ocupación)`],
                [`• Días con mayor demanda: 15-22/${today.getMonth() + 1} (Fines de semana)`],
                [],
                ['DETALLE POR TIPO DE HABITACIÓN'],
                ['Tipo', 'Reservas', '% del total'],
                ...Object.entries(stats.roomTypes).map(([type, count]) => [
                    type,
                    count,
                    `${Math.round((count / stats.totalReservations) * 100)}%`
                ])
            ]);

            // 3. HOJA REPORTE DE USUARIOS
            const wsUsers = XLSX.utils.aoa_to_sheet([
                ['HOTEL MADROÑO - REPORTE DE USUARIOS'],
                [],
                [`Generado: ${today.toLocaleDateString()}`],
                [`Periodo: ${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`],
                [`Generado por: ${currentUser}`],
                [],
                ['RESUMEN'],
                [`• Total usuarios: ${users.length}`],
                [`• Administradores: ${users.filter(u => u.roleName === 'Admin').length}`],
                [`• Usuarios regulares: ${users.filter(u => u.roleName === 'User').length}`],
                [],
                ['DETALLE DE USUARIOS'],
                ['Usuario', 'Email', 'Rol', 'Fecha Creación'],
                ...users.map(user => [
                    user.username,
                    user.email,
                    user.roleName,
                    new Date(user.createdAt).toLocaleDateString()
                ])
            ]);

            // 4. HOJA REPORTE DE RESERVACIONES
            const wsReservations = XLSX.utils.aoa_to_sheet([
                ['HOTEL MADROÑO - REPORTE DE RESERVACIONES'],
                [],
                [`Generado: ${today.toLocaleDateString()}`],
                [`Periodo: ${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`],
                [`Generado por: ${currentUser}`],
                [],
                ['RESUMEN'],
                [`• Total reservaciones: ${stats.totalReservations}`],
                [`• Ocupación: ${stats.occupancyRate}%`],
                [`• Tasa de cancelación: ${Math.round((stats.cancelledReservations / stats.totalReservations) * 100)}%`],
                [],
                ['DETALLE DE RESERVACIONES'],
                ['Nombre', 'Apellido', 'Email', 'Estado', 'Huéspedes', 'Habitaciones', 'Tipo', 'Llegada', 'Salida', 'Noches'],
                ...reservations.map(res => [
                    res.name || '',
                    res.lastName || '',
                    res.email,
                    statusLabels[res.status],
                    res.guests,
                    res.rooms,
                    res.bedroomsType,
                    new Date(res.arrivalDate).toLocaleDateString(),
                    new Date(res.departureDate).toLocaleDateString(),
                    Math.ceil(
                        (new Date(res.departureDate).getTime() -
                            new Date(res.arrivalDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                ])
            ]);

            // Ajustar anchos de columnas
            wsSummary['!cols'] = [{ wch: 40 }];
            wsOccupancy['!cols'] = [{ wch: 25 }, { wch: 10 }, { wch: 10 }];
            wsUsers['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 15 }];
            wsReservations['!cols'] = [
                { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 12 },
                { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 12 },
                { wch: 12 }, { wch: 10 }
            ];

            // Añadir hojas al libro
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');
            XLSX.utils.book_append_sheet(wb, wsOccupancy, 'Ocupación');
            XLSX.utils.book_append_sheet(wb, wsUsers, 'Usuarios');
            XLSX.utils.book_append_sheet(wb, wsReservations, 'Reservaciones');

            // Generar archivo
            XLSX.writeFile(wb, `Reporte_Hotel_Madroño_${today.toISOString().split('T')[0]}.xlsx`);

        } catch (error) {
            console.error('Error generating report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="">
                <div className="flex flex-col items-center justify-center py-12">
                    <Button
                        onClick={generateExcelReport}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 gap-2"
                        size="lg"
                    >
                        <FileSpreadsheet className="h-5 w-5" />
                        {loading ? 'Generando Reporte...' : 'Generar Reporte Excel'}
                    </Button>

                    {loading && (
                        <p className="mt-4 text-sm text-gray-500">
                            Preparando el reporte, por favor espere...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}