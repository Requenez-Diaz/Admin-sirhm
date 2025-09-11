import { Reservation } from "@prisma/client";
import { jsPDF } from "jspdf";

interface PDFReservationComparisonRenderProps {
    doc: jsPDF;
    reservations: Reservation[];
    month: number;
    year: number;
    startY: number;
}

interface ComparisonResult {
    currentMonthCount: number;
    previousMonthCount: number;
    sameMonthLastYearCount: number;
    growthMonthPercentage: number | null;
    growthYearPercentage: number | null;
}

function getReservationComparison({
    reservations,
    month,
    year,
}: {
    reservations: Reservation[];
    month: number;
    year: number;
}): ComparisonResult {
    const currentMonthCount = reservations.filter((r) => {
        const d = new Date(r.arrivalDate);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    }).length;

    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
        previousMonth = 12;
        previousYear = year - 1;
    }

    const previousMonthCount = reservations.filter((r) => {
        const d = new Date(r.arrivalDate);
        return d.getMonth() + 1 === previousMonth && d.getFullYear() === previousYear;
    }).length;

    const sameMonthLastYearCount = reservations.filter((r) => {
        const d = new Date(r.arrivalDate);
        return d.getMonth() + 1 === month && d.getFullYear() === year - 1;
    }).length;

    const growthMonthPercentage =
        previousMonthCount === 0
            ? null
            : ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;

    const growthYearPercentage =
        sameMonthLastYearCount === 0
            ? null
            : ((currentMonthCount - sameMonthLastYearCount) / sameMonthLastYearCount) * 100;

    return {
        currentMonthCount,
        previousMonthCount,
        sameMonthLastYearCount,
        growthMonthPercentage,
        growthYearPercentage,
    };
}

export default function PDFReservationComparisonRender({
    doc,
    reservations,
    month,
    year,
    startY,
}: PDFReservationComparisonRenderProps): number {
    const y = startY + 2;
    const comparison = getReservationComparison({ reservations, month, year });

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Comparativa de Reservaciones", 14, y);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    let currentY = y + 8;

    doc.text(`Reservaciones este mes: ${comparison.currentMonthCount}`, 14, currentY);
    currentY += 6;

    doc.text(`Mes anterior: ${comparison.previousMonthCount}`, 14, currentY);
    currentY += 6;

    doc.text(
        `Crecimiento respecto al mes anterior: ${comparison.growthMonthPercentage !== null
            ? comparison.growthMonthPercentage.toFixed(1) + "%"
            : "N/A"
        }`,
        14,
        currentY
    );
    currentY += 6;

    doc.text(`Mismo mes del año pasado: ${comparison.sameMonthLastYearCount}`, 14, currentY);
    currentY += 6;

    doc.text(
        `Crecimiento respecto al mismo mes del año anterior: ${comparison.growthYearPercentage !== null
            ? comparison.growthYearPercentage.toFixed(1) + "%"
            : "N/A"
        }`,
        14,
        currentY
    );

    doc.line(14, currentY + 2, 196, currentY + 2);

    return currentY + 8;
}
