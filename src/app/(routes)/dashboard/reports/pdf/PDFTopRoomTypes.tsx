'use client';
import { jsPDF } from 'jspdf';

interface PDFTopRoomTypesProps {
    doc: jsPDF;
    roomTypesCount: Record<string, number>;
}

const PDFTopRoomTypes: React.FC<PDFTopRoomTypesProps> = ({ doc, roomTypesCount }) => {
    const sorted = Object.entries(roomTypesCount).sort((a, b) => b[1] - a[1]);
    const topRooms = sorted.slice(0, 5);

    doc.setFontSize(13);
    doc.setTextColor(33, 33, 33);
    doc.text('Ocupación por Tipo de Habitación:', 14, 74);

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(0, 102, 204);

    doc.rect(14, 80, 90, 8, 'F');
    doc.rect(104, 80, 40, 8, 'F');

    doc.text('Habitaciones', 59, 86, { align: 'center' });
    doc.text('Reservaciones', 124, 86, { align: 'center' });

    let y = 94;
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    topRooms.forEach(([type, count]) => {
        doc.rect(14, y - 6, 90, 8);
        doc.text(type, 59, y, { align: 'center' });

        doc.rect(104, y - 6, 40, 8);
        doc.text(String(count), 124, y, { align: 'center' });

        y += 10;
    });

    doc.setDrawColor(180);
    doc.line(14, y, 196, y);

    return null;
};

export default PDFTopRoomTypes;
