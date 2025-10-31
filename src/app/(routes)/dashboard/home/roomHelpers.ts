import { parseISO, isSameMonth, startOfWeek, endOfWeek, isWithinInterval, isSameDay } from 'date-fns';

export const ROOM_TYPE_ALIASES: Record<string, { name: string; color: string }> = {
    'habitacion con abanico': { name: 'Habitación con abanico', color: '#FF8042' },
    'habitacion doble con abanico': { name: 'Habitación Doble con abanico', color: '#FFBB28' },
    'con aire acondicionado': { name: 'Con aire acondicionado', color: '#0088FE' },
    'doble con aire acondicionado': { name: 'Doble con aire acondicionado', color: '#00C49F' },
};

export const normalizeString = (str: string) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

export function filterReservations(
    reservations: any[],
    filterType: string,
    currentDate: Date,
    selectedMonthIndex: number,
    selectedWeekIndex: number,
    selectedDay: number,
    currentYear: number
) {
    return reservations.filter(res => {
        if (res.status !== 'CONFIRMED' || !res.arrivalDate) return false;
        const arrivalDate = typeof res.arrivalDate === 'string' ? parseISO(res.arrivalDate) : new Date(res.arrivalDate);

        if (filterType === 'today') return isSameDay(arrivalDate, currentDate);
        if (filterType === 'month') return isSameMonth(arrivalDate, new Date(currentYear, selectedMonthIndex, 1));
        if (filterType === 'week') {
            const start = startOfWeek(new Date(currentYear, selectedMonthIndex, 1 + selectedWeekIndex * 7), { weekStartsOn: 1 });
            const end = endOfWeek(start, { weekStartsOn: 1 });
            return isWithinInterval(arrivalDate, { start, end });
        }
        if (filterType === 'day') {
            const selectedDate = new Date(currentYear, selectedMonthIndex, selectedDay);
            return isSameDay(arrivalDate, selectedDate);
        }
        return false;
    });
}
