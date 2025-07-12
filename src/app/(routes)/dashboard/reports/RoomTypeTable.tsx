'use client'

import React, { useMemo, useState } from 'react'
import { parseISO, isSameMonth } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Reservation = {
    bedroomsType: string
    status: string
    rooms: number
    arrivalDate: Date | string
}

type Props = {
    reservations: Reservation[]
}

const ROOM_TYPE_ALIASES: Record<string, { name: string; color: string }> = {
    'habitacion con abanico': {
        name: 'Habitación con abanico',
        color: '#FF8042'
    },
    'habitacion doble con abanico': {
        name: 'Habitación Doble con abanico',
        color: '#FFBB28'
    },
    'con aire acondicionado': {
        name: 'Con aire acondicionado',
        color: '#0088FE'
    },
    'doble con aire acondicionado': {
        name: 'Doble con aire acondicionado',
        color: '#00C49F'
    }
}

const normalizeString = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

const RoomTypeTable: React.FC<Props> = ({ reservations }) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth()

    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonth)
    const [filterType, setFilterType] = useState<'month' | 'today'>('month')

    const monthOptions = Array.from({ length: currentMonth + 1 }, (_, i) => {
        const date = new Date(currentYear, i, 1)
        return {
            value: i,
            label: date.toLocaleString('es-ES', { month: 'long' }),
            shortName: date.toLocaleString('es-ES', { month: 'short' })
        }
    }).reverse()

    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            if (res.status !== 'CONFIRMED' || !res.arrivalDate) return false

            const arrivalDate =
                typeof res.arrivalDate === 'string' ? parseISO(res.arrivalDate) : new Date(res.arrivalDate)

            if (filterType === 'today') {
                return (
                    arrivalDate.getDate() === currentDate.getDate() &&
                    arrivalDate.getMonth() === currentDate.getMonth() &&
                    arrivalDate.getFullYear() === currentDate.getFullYear()
                )
            }

            return isSameMonth(arrivalDate, new Date(currentYear, selectedMonthIndex, 1))
        })
    }, [reservations, selectedMonthIndex, filterType])

    const calculateRoomDetails = () => {
        const roomTypes: Record<string, { total: number; color: string }> = {}

        filteredReservations.forEach(res => {
            const normalizedType = normalizeString(res.bedroomsType)
            const roomTypeInfo =
                Object.entries(ROOM_TYPE_ALIASES).find(([alias]) => normalizeString(alias) === normalizedType)?.[1] ||
                { name: res.bedroomsType, color: '#888' }

            if (!roomTypes[roomTypeInfo.name]) {
                roomTypes[roomTypeInfo.name] = { total: 0, color: roomTypeInfo.color }
            }

            roomTypes[roomTypeInfo.name].total += 1
        })

        return Object.entries(roomTypes)
            .map(([type, data]) => ({
                type,
                total: data.total,
                color: data.color
            }))
            .sort((a, b) => b.total - a.total)
    }

    const roomDetails = calculateRoomDetails()
    const totalReservations = roomDetails.reduce((sum, room) => sum + room.total, 0)

    const currentMonthName = new Date(currentYear, selectedMonthIndex, 1).toLocaleString('es-ES', {
        month: 'long'
    })

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                    <CardTitle className="text-lg font-semibold text-foreground">
                        Reservaciones por Tipo de Habitación
                    </CardTitle>
                    <div className="flex gap-2">
                        <Select value={filterType} onValueChange={(value) => setFilterType(value as 'month' | 'today')}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Filtro" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Ver por mes</SelectItem>
                                <SelectItem value="today">Solo hoy</SelectItem>
                            </SelectContent>
                        </Select>
                        {filterType === 'month' && (
                            <Select value={String(selectedMonthIndex)} onValueChange={(value) => setSelectedMonthIndex(Number(value))}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccionar mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((month) => (
                                        <SelectItem key={month.value} value={String(month.value)}>
                                            {month.label} {currentYear}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Tipo de Habitación</TableHead>
                                <TableHead className="text-center">Reservaciones</TableHead>
                                <TableHead className="text-center">Porcentaje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roomDetails.map((room, index) => {
                                const percentage = totalReservations > 0
                                    ? Math.round((room.total / totalReservations) * 100)
                                    : 0

                                return (
                                    <TableRow key={index} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: room.color }} />
                                                {room.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="px-3 py-1">
                                                {room.total}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <span>{percentage}%</span>
                                                <div className="relative w-16 h-2 bg-secondary rounded-full overflow-hidden">
                                                    <div className="absolute h-full" style={{ width: `${percentage}%`, backgroundColor: room.color }} />
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                            {roomDetails.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                        No hay datos disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                            {roomDetails.length > 0 && (
                                <TableRow className="bg-muted/50 font-medium">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="default" className="px-3 py-1">
                                            {totalReservations}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">100%</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="p-4 text-center text-sm text-muted-foreground border-t">
                        {filterType === 'today'
                            ? currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                            : `${currentMonthName} ${currentYear}`}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RoomTypeTable
