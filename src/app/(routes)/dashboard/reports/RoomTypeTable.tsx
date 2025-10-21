'use client'

import React, { useMemo, useState } from 'react'
import {
    parseISO,
    isSameMonth,
    startOfWeek,
    endOfWeek,
    isWithinInterval,
    isSameDay,
    getWeeksInMonth,
} from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'

type Reservation = {
    bedroomsType: string
    status: string
    rooms: number
    guests: number
    arrivalDate: Date | string
}

type Props = {
    reservations: Reservation[]
}

const ROOM_TYPE_ALIASES: Record<string, { name: string; color: string }> = {
    'habitacion con abanico': { name: 'Habitación con abanico', color: '#FF8042' },
    'habitacion doble con abanico': { name: 'Habitación Doble con abanico', color: '#FFBB28' },
    'con aire acondicionado': { name: 'Con aire acondicionado', color: '#0088FE' },
    'doble con aire acondicionado': { name: 'Doble con aire acondicionado', color: '#00C49F' },
}

const normalizeString = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

const RoomTypeTable: React.FC<Props> = ({ reservations }) => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    const [filterType, setFilterType] = useState<'month' | 'week' | 'day' | 'today'>('month')
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentDate.getMonth())
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(0)
    const [selectedDay, setSelectedDay] = useState(currentDate.getDate())

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1)
        return { value: i, label: date.toLocaleString('es-ES', { month: 'long' }) }
    })

    const weeksInSelectedMonth = getWeeksInMonth(new Date(currentYear, selectedMonthIndex, 1), { weekStartsOn: 1 })
    const weekOptions = Array.from({ length: weeksInSelectedMonth }, (_, i) => {
        const start = startOfWeek(new Date(currentYear, selectedMonthIndex, 1 + i * 7), { weekStartsOn: 1 })
        const end = endOfWeek(start, { weekStartsOn: 1 })
        return {
            value: i,
            label: `${start.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`,
        }
    })

    // Filtrar solo reservaciones CONFIRMADAS según filtro
    const filteredReservations = useMemo(() => {
        return reservations.filter(res => {
            if (res.status !== 'CONFIRMED' || !res.arrivalDate) return false
            const arrivalDate = typeof res.arrivalDate === 'string' ? parseISO(res.arrivalDate) : new Date(res.arrivalDate)

            if (filterType === 'today') return isSameDay(arrivalDate, currentDate)
            if (filterType === 'month') return isSameMonth(arrivalDate, new Date(currentYear, selectedMonthIndex, 1))
            if (filterType === 'week') {
                const start = startOfWeek(new Date(currentYear, selectedMonthIndex, 1 + selectedWeekIndex * 7), { weekStartsOn: 1 })
                const end = endOfWeek(start, { weekStartsOn: 1 })
                return isWithinInterval(arrivalDate, { start, end })
            }
            if (filterType === 'day') {
                const selectedDate = new Date(currentYear, selectedMonthIndex, selectedDay)
                return isSameDay(arrivalDate, selectedDate)
            }
            return false
        })
    }, [reservations, filterType, selectedMonthIndex, selectedWeekIndex, selectedDay, currentDate, currentYear])

    // Calcular resumen por tipo de habitación
    const calculateRoomDetails = () => {
        const roomTypes: Record<string, { total: number; color: string; guests: number }> = {}
        filteredReservations.forEach(res => {
            const normalizedType = normalizeString(res.bedroomsType)
            const roomTypeInfo = Object.entries(ROOM_TYPE_ALIASES).find(([alias]) => normalizeString(alias) === normalizedType)?.[1] || {
                name: res.bedroomsType,
                color: '#888',
            }
            if (!roomTypes[roomTypeInfo.name]) roomTypes[roomTypeInfo.name] = { total: 0, color: roomTypeInfo.color, guests: 0 }
            roomTypes[roomTypeInfo.name].total += 1
            roomTypes[roomTypeInfo.name].guests += res.guests || 0
        })

        return Object.entries(roomTypes)
            .map(([type, data]) => ({ type, total: data.total, color: data.color, guests: data.guests }))
            .sort((a, b) => b.total - a.total)
    }

    const roomDetails = calculateRoomDetails()
    const totalReservations = roomDetails.reduce((sum, room) => sum + room.total, 0)
    const totalGuests = roomDetails.reduce((sum, room) => sum + room.guests, 0)

    let dateLabel = ''
    if (filterType === 'today') dateLabel = currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    else if (filterType === 'month') dateLabel = `${monthOptions[selectedMonthIndex].label} ${currentYear}`
    else if (filterType === 'week') dateLabel = weekOptions[selectedWeekIndex]?.label || ''
    else if (filterType === 'day') dateLabel = new Date(currentYear, selectedMonthIndex, selectedDay).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="px-6 py-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                    <CardTitle className="text-lg font-semibold text-foreground">Reservaciones por Tipo de Habitación</CardTitle>

                    <div className="flex gap-2 flex-wrap">
                        <Select value={filterType} onValueChange={value => setFilterType(value as any)}>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Filtro" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="month">Ver por mes</SelectItem>
                                <SelectItem value="week">Ver por semana</SelectItem>
                                <SelectItem value="day">Ver por día</SelectItem>
                                <SelectItem value="today">Solo hoy</SelectItem>
                            </SelectContent>
                        </Select>

                        {(filterType === 'month' || filterType === 'week') && (
                            <Select value={String(selectedMonthIndex)} onValueChange={value => setSelectedMonthIndex(Number(value))}>
                                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Seleccionar mes" /></SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map(month => (
                                        <SelectItem key={month.value} value={String(month.value)}>{month.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {filterType === 'week' && (
                            <Select value={String(selectedWeekIndex)} onValueChange={value => setSelectedWeekIndex(Number(value))}>
                                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Seleccionar semana" /></SelectTrigger>
                                <SelectContent>
                                    {weekOptions.map(week => (
                                        <SelectItem key={week.value} value={String(week.value)}>{week.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>

                {filterType === 'day' && (
                    <div className="mt-4">
                        <Calendar
                            mode="single"
                            selected={new Date(currentYear, selectedMonthIndex, selectedDay)}
                            onSelect={date => {
                                if (date) {
                                    setSelectedDay(date.getDate())
                                    setSelectedMonthIndex(date.getMonth())
                                }
                            }}
                            month={new Date(currentYear, selectedMonthIndex)}
                            onMonthChange={date => setSelectedMonthIndex(date.getMonth())}
                            weekStartsOn={1}
                        />
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-0">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[200px]">Tipo de Habitación</TableHead>
                                <TableHead className="text-center">Reservaciones</TableHead>
                                <TableHead className="text-center">Huéspedes</TableHead>
                                <TableHead className="text-center">Porcentaje</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roomDetails.map((room, index) => {
                                const percentage = totalReservations > 0 ? Math.round((room.total / totalReservations) * 100) : 0
                                return (
                                    <TableRow key={index} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <div className="flex items-center">
                                                <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: room.color }} />
                                                {room.type}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center"><Badge variant="outline" className="px-3 py-1">{room.total}</Badge></TableCell>
                                        <TableCell className="text-center"><Badge variant="outline" className="px-3 py-1">{room.guests}</Badge></TableCell>
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
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No hay datos disponibles</TableCell>
                                </TableRow>
                            )}

                            {roomDetails.length > 0 && (
                                <TableRow className="bg-muted/50 font-medium">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="text-center"><Badge variant="default" className="px-3 py-1">{totalReservations}</Badge></TableCell>
                                    <TableCell className="text-center"><Badge variant="default" className="px-3 py-1">{totalGuests}</Badge></TableCell>
                                    <TableCell className="text-center">100%</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <div className="p-4 text-center text-sm text-muted-foreground border-t">{dateLabel}</div>
                </div>
            </CardContent>
        </Card>
    )
}

export default RoomTypeTable
