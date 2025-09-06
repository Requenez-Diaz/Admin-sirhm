import { jsPDF } from 'jspdf';

interface PDFTotalGuestsProps {
    doc: jsPDF;
    guestsCounts: number[];
    startY: number;
}

export default function PDFTotalGuests({
    doc,
    guestsCounts,
    startY,
}: PDFTotalGuestsProps): number {
    const y = startY;
    const totalGuests = guestsCounts.reduce((sum, count) => sum + count, 0);

    doc.setFontSize(13);
    doc.text('Número de huéspedes atendidos:', 14, y);

    doc.setFontSize(11);
    doc.text(`${totalGuests} personas en total`, 14, y + 8);

    doc.line(14, y + 12, 196, y + 12);

    return y + 20;
}
