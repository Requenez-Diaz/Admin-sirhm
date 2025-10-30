import { jsPDF } from 'jspdf';

interface PDFReportHeaderProps {
    doc: jsPDF;
    generatedBy: string;
    generatedAt: string;
    reportPeriod: string;
    startY: number;
}

async function loadLogoBase64(): Promise<string> {
    const response = await fetch('/logo.png');
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export default async function PDFReportHeader({
    doc,
    generatedBy,
    generatedAt,
    reportPeriod,
    startY,
}: PDFReportHeaderProps): Promise<number> {
    const y = startY;

    const logoBase64 = await loadLogoBase64();

    const logoX = 14;
    const logoY = y;
    const logoWidth = 25;
    const logoHeight = 25;
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

    const pageWidth = doc.internal.pageSize.getWidth();
    const centerX = pageWidth / 2;

    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.setFont('helvetica', 'bold');
    doc.text('HOTEL MADROÑO', centerX, y + 8, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 102, 204);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE GENERAL', centerX, y + 16, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado por: ${generatedBy}`, 14, y + 30);
    doc.text(`Fecha: ${generatedAt}`, 14, y + 35);
    doc.text(`Periodo del reporte: ${reportPeriod}`, 14, y + 40);

    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(14, y + 43, 196, y + 43);

    return y + 53;
}
