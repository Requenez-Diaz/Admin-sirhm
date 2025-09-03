import { jsPDF } from 'jspdf';

interface PDFReportHeaderProps {
    doc: jsPDF;
    generatedBy: string;
    generatedAt: string;
    reportPeriod: string;
}

const PDFReportHeader = ({ doc, generatedBy, generatedAt, reportPeriod }: PDFReportHeaderProps) => {
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('HOTEL MADROÑO', 105, 15, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.setFont(undefined as unknown as string, 'bold');
    doc.text('REPORTE GENERAL', 105, 22, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont('helvetica', 'normal');

    doc.text(`Generado por: ${generatedBy}`, 14, 32);
    doc.text(`Fecha: ${generatedAt}`, 14, 37);
    doc.text(`Periodo del reporte: ${reportPeriod}`, 14, 42);

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(14, 45, 196, 45);
};

export default PDFReportHeader;
