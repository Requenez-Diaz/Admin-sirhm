import { jsPDF } from 'jspdf';

interface RoomTypeData {
    reservations: number;
    guests: number;
}

interface PDFTopRoomTypesProps {
    doc: jsPDF;
    roomTypesCount: Record<string, RoomTypeData>;
    startY: number;
}

export default function PDFTopRoomTypes({
    doc,
    roomTypesCount,
    startY,
}: PDFTopRoomTypesProps): number {
    const y = startY;
    const sorted = Object.entries(roomTypesCount).sort(
        (a, b) => b[1].reservations - a[1].reservations
    );
    const topRooms = sorted.slice(0, 5);

    // Título
    doc.setFontSize(13);
    doc.setTextColor(33, 33, 33);
    doc.text('Ocupación por Tipo de Habitación:', 14, y);

    // Encabezado de la tabla
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 102, 204);

    doc.rect(14, y + 6, 90, 8, 'F');   // Habitaciones
    doc.rect(104, y + 6, 40, 8, 'F');  // Reservaciones
    doc.rect(144, y + 6, 40, 8, 'F');  // Huespedes

    doc.text('Habitaciones', 59, y + 12, { align: 'center' });
    doc.text('Reservaciones', 124, y + 12, { align: 'center' });
    doc.text('Huespedes', 164, y + 12, { align: 'center' });

    // Filas de la tabla
    let rowY = y + 20;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    topRooms.forEach(([type, data]) => {
        doc.rect(14, rowY - 6, 90, 8);
        doc.text(type, 59, rowY, { align: 'center' });

        doc.rect(104, rowY - 6, 40, 8);
        doc.text(String(data.reservations), 124, rowY, { align: 'center' });

        doc.rect(144, rowY - 6, 40, 8);
        doc.text(String(data.guests), 164, rowY, { align: 'center' });

        rowY += 10;
    });

    // Línea separadora al final
    doc.setDrawColor(180);
    doc.line(14, rowY, 196, rowY);

    return rowY + 10;
}
