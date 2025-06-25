'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

type Reservation = {
    bedroomsType: string
    status: string
    rooms: number
}

type Props = {
    reservations: Reservation[]
}

const RoomTypeTable: React.FC<Props> = ({ reservations }) => {
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

    const calculateRoomDetails = () => {
        const roomTypes: Record<string, { total: number; occupied: number; revenue: number }> = {}

        reservations.forEach(res => {
            const type = res.bedroomsType
            if (!roomTypes[type]) {
                roomTypes[type] = { total: 0, occupied: 0, revenue: 0 }
            }

            roomTypes[type].total += 1
            if (res.status === 'CONFIRMED') {
                roomTypes[type].occupied += 1
                roomTypes[type].revenue += res.rooms * 50
            }
        })

        return Object.entries(roomTypes).map(([type, data]) => ({
            type,
            total: data.total,
            occupied: data.occupied,
            occupancyRate: Math.round((data.occupied / data.total) * 100),
            revenue: data.revenue
        }))
    }

    const roomDetails = calculateRoomDetails()

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                    Resumen por Tipo de Habitación
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Tipo</TableHead>
                                <TableHead className="text-center">Total</TableHead>
                                <TableHead className="text-center">Ocupadas</TableHead>
                                <TableHead className="text-center">% Ocupación</TableHead>
                                <TableHead className="text-right">Ingresos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roomDetails.map((room, index) => (
                                <TableRow key={index} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{room.type}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="px-3 py-1">
                                            {room.total}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{room.occupied}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <span>{room.occupancyRate}%</span>
                                            <div className="relative w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="absolute h-full bg-primary"
                                                    style={{ width: `${room.occupancyRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                                        {formatCurrency(room.revenue)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {roomDetails.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No data available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}

export default RoomTypeTable
