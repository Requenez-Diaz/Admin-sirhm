import { jsPDF } from 'jspdf';

interface PDFReportHeaderProps {
    doc: jsPDF;
    generatedBy: string;
    generatedAt: string;
    reportPeriod: string;
    startY: number;
}

export default function PDFReportHeader({
    doc,
    generatedBy,
    generatedAt,
    reportPeriod,
    startY,
}: PDFReportHeaderProps): number {
    const y = startY;

    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('HOTEL MADROÑO', 105, y, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('REPORTE GENERAL', 105, y + 7, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont('helvetica', 'normal');

    doc.text(`Generado por: ${generatedBy}`, 14, y + 17);
    doc.text(`Fecha: ${generatedAt}`, 14, y + 22);
    doc.text(`Periodo del reporte: ${reportPeriod}`, 14, y + 27);

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(14, y + 30, 196, y + 30);

    return y + 40;
}
