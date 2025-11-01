import { jsPDF } from "jspdf";
import { Reservation } from "@prisma/client";

interface Bedroom {
    typeBedroom: string;
    price: number;
}

interface PDFEstimatedIncomeProps {
    doc: jsPDF;
    reservations: Reservation[];
    bedrooms: Bedroom[];
    startY: number;
}

function checkPageEnd(doc: jsPDF, y: number, offset = 20): number {
    if (y > 270) {
        doc.addPage();
        return offset;
    }
    return y;
}

export default function PDFEstimatedIncome({
    doc,
    reservations,
    bedrooms,
    startY,
}: PDFEstimatedIncomeProps): number {
    let currentY = startY;

    const totalIncome = reservations.reduce((sum, r) => {
        const bedroom = bedrooms.find((b) => b.typeBedroom === r.bedroomsType);
        const price = bedroom?.price || 0;
        return sum + price * r.rooms;
    }, 0);

    const avgPerReservation =
        reservations.length > 0 ? totalIncome / reservations.length : 0;
    const totalGuests = reservations.reduce((sum, r) => sum + r.guests, 0);
    const avgPerGuest = totalGuests > 0 ? totalIncome / totalGuests : 0;

    currentY = checkPageEnd(doc, currentY);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Ingresos Estimados", 14, currentY);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    currentY += 8;
    doc.text(`Ingreso total: C$${totalIncome.toFixed(2)}`, 14, currentY);

    currentY += 6;
    doc.text(
        `Ingreso promedio por reservación: C$${avgPerReservation.toFixed(2)}`,
        14,
        currentY
    );

    currentY += 6;
    doc.text(
        `Ingreso promedio por huésped: C$${avgPerGuest.toFixed(2)}`,
        14,
        currentY
    );

    currentY += 6;
    doc.setDrawColor(180);
    doc.line(14, currentY, 196, currentY);

    return currentY + 8;
}
