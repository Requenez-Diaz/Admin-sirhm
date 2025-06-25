'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface QuickStatsProps {
    mostRequestedType: string;
    mostRequestedRate: number;
    totalReservations: number;
    confirmedReservations: number;
    pendingReservations: number;
    cancelledReservations: number;
}

export function QuickStats({
    mostRequestedType,
    mostRequestedRate,
    totalReservations,
    confirmedReservations,
    pendingReservations,
    cancelledReservations,
}: QuickStatsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estadísticas Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm text-gray-500">Habitación más solicitada</p>
                    <p className="text-lg font-semibold">
                        {mostRequestedType} ({mostRequestedRate}%)
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total reservaciones</p>
                    <p className="text-lg font-semibold">{totalReservations}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Confirmadas</p>
                    <p className="text-lg font-semibold text-green-600">
                        {confirmedReservations}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <p className="text-lg font-semibold text-yellow-600">
                        {pendingReservations}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Canceladas</p>
                    <p className="text-lg font-semibold text-red-600">
                        {cancelledReservations}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}