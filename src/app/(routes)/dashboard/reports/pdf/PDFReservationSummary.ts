import { jsPDF } from 'jspdf';

interface PDFReservationSummaryProps {
    doc: jsPDF;
    total: number;
    startY: number;
}

export default function PDFReservationSummary({
    doc,
    total,
    startY,
}: PDFReservationSummaryProps): number {
    const y = startY;

    doc.setFontSize(13);
    doc.text('Resumen General:', 14, y);

    doc.setFontSize(11);
    doc.text(`Total de reservaciones realizadas: ${total}`, 14, y + 8);

    doc.line(14, y + 12, 196, y + 12);

    return y + 20;
}
