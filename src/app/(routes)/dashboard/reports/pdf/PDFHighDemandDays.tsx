import { jsPDF } from 'jspdf';

interface PDFTopDemandDaysProps {
    doc: jsPDF;
    arrivalDates: (string | Date)[];
}

export default function PDFTopDemandDays({ doc, arrivalDates }: PDFTopDemandDaysProps) {
    const daysMap: Record<number, number> = {
        0: 0, // Domingo
        1: 0, // Lunes
        2: 0, // Martes
        3: 0, // Miércoles
        4: 0, // Jueves
        5: 0, // Viernes
        6: 0, // Sábado
    };

    const dayNames = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado'
    ];

    // Contar reservas por día de la semana
    arrivalDates.forEach(date => {
        const d = new Date(date);
        if (!isNaN(d.getTime())) {
            daysMap[d.getDay()]++;
        }
    });

    // Ordenar días por mayor demanda y obtener el primero
    const sortedDays = Object.entries(daysMap)
        .filter(([_, count]) => count > 0)
        .sort((a, b) => Number(b[1]) - Number(a[1]));

    if (sortedDays.length === 0) {
        doc.text('No hay datos de reservas para mostrar días con mayor demanda.', 14, 110);
        return;
    }

    const [topDayIndexStr, topDayCount] = sortedDays[0];
    const topDayIndex = Number(topDayIndexStr);
    const topDayName = dayNames[topDayIndex];

    const firstMatchingDate = arrivalDates
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()) && d.getDay() === topDayIndex)
        .sort((a, b) => a.getTime() - b.getTime())[0];

    const formattedDate = firstMatchingDate
        ? firstMatchingDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Fecha no disponible';

    doc.setFontSize(13);
    doc.text('Día con mayor demanda:', 14, 110);

    doc.setFontSize(11);
    doc.text(`${topDayName}: ${topDayCount} reservas`, 14, 118);

    doc.setFontSize(10);
    doc.text(`Fecha representativa: ${formattedDate}`, 14, 126);

    doc.line(14, 130, 196, 130);
}
