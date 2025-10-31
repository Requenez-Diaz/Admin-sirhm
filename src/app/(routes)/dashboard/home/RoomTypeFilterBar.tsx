'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';

interface RoomTypeFilterBarProps {
    filterType: string;
    selectedMonthIndex: number;
    selectedWeekIndex: number;
    selectedDay: number;
    currentYear: number;
    monthOptions: { value: number; label: string }[];
    weekOptions: { value: number; label: string }[];
    setFilterType: (value: any) => void;
    setSelectedMonthIndex: (value: number) => void;
    setSelectedWeekIndex: (value: number) => void;
    setSelectedDay: (value: number) => void;
}

export function RoomTypeFilterBar({
    filterType,
    selectedMonthIndex,
    selectedWeekIndex,
    selectedDay,
    currentYear,
    monthOptions,
    weekOptions,
    setFilterType,
    setSelectedMonthIndex,
    setSelectedWeekIndex,
    setSelectedDay,
}: RoomTypeFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
            <div className="flex gap-2 flex-wrap">
                <Select value={filterType} onValueChange={value => setFilterType(value)}>
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

            {filterType === 'day' && (
                <Calendar
                    mode="single"
                    selected={new Date(currentYear, selectedMonthIndex, selectedDay)}
                    onSelect={date => {
                        if (date) {
                            setSelectedDay(date.getDate());
                            setSelectedMonthIndex(date.getMonth());
                        }
                    }}
                    month={new Date(currentYear, selectedMonthIndex)}
                    onMonthChange={date => setSelectedMonthIndex(date.getMonth())}
                    weekStartsOn={1}
                />
            )}
        </div>
    );
}
