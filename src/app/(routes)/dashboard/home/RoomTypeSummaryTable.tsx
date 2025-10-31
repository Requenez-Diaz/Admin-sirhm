'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RoomTypeSummaryTableProps {
    roomDetails: { type: string; total: number; color: string; guests: number }[];
    totalReservations: number;
    totalGuests: number;
}

export function RoomTypeSummaryTable({ roomDetails, totalReservations, totalGuests }: RoomTypeSummaryTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Tipo de Habitación</TableHead>
                        <TableHead className="text-center">Reservaciones</TableHead>
                        <TableHead className="text-center">Huéspedes</TableHead>
                        <TableHead className="text-center">Porcentaje</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roomDetails.map((room, index) => {
                        const percentage = totalReservations > 0 ? Math.round((room.total / totalReservations) * 100) : 0;
                        return (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: room.color }} />
                                        {room.type}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center"><Badge variant="outline">{room.total}</Badge></TableCell>
                                <TableCell className="text-center"><Badge variant="outline">{room.guests}</Badge></TableCell>
                                <TableCell className="text-center">{percentage}%</TableCell>
                            </TableRow>
                        );
                    })}

                    {roomDetails.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay datos disponibles
                            </TableCell>
                        </TableRow>
                    )}

                    {roomDetails.length > 0 && (
                        <TableRow className="bg-muted/50 font-medium">
                            <TableCell>Total</TableCell>
                            <TableCell className="text-center"><Badge variant="default">{totalReservations}</Badge></TableCell>
                            <TableCell className="text-center"><Badge variant="default">{totalGuests}</Badge></TableCell>
                            <TableCell className="text-center">100%</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
