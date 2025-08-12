import { jsPDF } from 'jspdf';

interface PDFTotalGuestsProps {
    doc: jsPDF;
    guestsCounts: number[];
}

export default function PDFTotalGuests({ doc, guestsCounts }: PDFTotalGuestsProps) {
    const totalGuests = guestsCounts.reduce((sum, count) => sum + count, 0);

    doc.setFontSize(13);
    doc.text('Número de huéspedes atendidos:', 14, 140);

    doc.setFontSize(11);
    doc.text(`${totalGuests} personas en total`, 14, 148);

    doc.line(14, 152, 196, 152);
}
