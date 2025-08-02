import { jsPDF } from 'jspdf';

interface PDFReservationSummaryProps {
    doc: jsPDF;
    total: number;
}

export default function PDFReservationSummary({ doc, total }: PDFReservationSummaryProps) {
    doc.setFontSize(13);
    doc.text('Resumen General:', 14, 54);

    doc.setFontSize(11);
    doc.text(`Total de reservaciones realizadas: ${total}`, 14, 62);

    doc.line(14, 66, 196, 66);
}
