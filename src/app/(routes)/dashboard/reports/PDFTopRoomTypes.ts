import { bedroomsTypes } from '@/bedroomstype/bedroomsType';
import { jsPDF } from 'jspdf';

interface PDFTopRoomTypesProps {
    doc: jsPDF;
    roomTypes: string[];
}

export default function PDFTopRoomTypes({ doc, roomTypes }: PDFTopRoomTypesProps) {
    const roomTypeCount: Record<string, number> = {};

    bedroomsTypes.forEach(type => {
        roomTypeCount[type] = 0;
    });

    roomTypes.forEach(type => {
        if (bedroomsTypes.includes(type)) {
            roomTypeCount[type]++;
        }
    });

    const sorted = Object.entries(roomTypeCount).sort((a, b) => b[1] - a[1]);

    const topRooms = sorted.slice(0, 5);

    doc.setFontSize(13);
    doc.text('Ocupación por Tipo de Habitación:', 14, 74);

    doc.setFontSize(11);
    let y = 82;
    topRooms.forEach(([type, count], index) => {
        doc.text(`${index + 1}. ${type} - ${count} reservaciones`, 14, y);
        y += 6;
    });

    doc.line(14, y, 196, y);
}
