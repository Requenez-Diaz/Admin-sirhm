"use client";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { getReservations } from "@/app/actions/reservation";
import PDFReportHeader from "./PdfReportHeader";
import PDFReservationSummary from "./PDFReservationSummary";
import PDFTopRoomTypes from "./PDFTopRoomTypes";
import PDFTotalGuests from "./PDFTotalGuests";
import PDFHighDemandDays from "./PDFHighDemandDays";
import { getBedrooms } from "@/app/actions/bedrooms";

interface Reservation {
    arrivalDate: string | Date;
    roomType: string;
    guests: number;
}

interface PDFReportGenerateProps {
    month: number;
    year: number;
}

const PDFReportGenerate: React.FC<PDFReportGenerateProps> = ({ month, year }) => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const currentUser = "Administrador";

    useEffect(() => {
        (async () => {
            try {
                const data = await getReservations();
                const mapped: Reservation[] = data.map((res) => ({
                    arrivalDate: res.arrivalDate,
                    roomType: res.bedroomsType,
                    guests: res.guests,
                }));
                setReservations(mapped);
            } catch (error) {
                console.error("Error cargando reservas:", error);
            }
        })();
    }, []);

    const generatePDF = async () => {
        // Filtrar por mes/año
        const filteredReservations = reservations.filter((r) => {
            const d = new Date(r.arrivalDate);
            return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        if (filteredReservations.length === 0) {
            alert("No hay datos de reservas para el mes/año seleccionado.");
            return;
        }

        const doc = new jsPDF();
        const now = new Date();

        const generatedAt = now.toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        // Calcular periodo del reporte
        const validDates = filteredReservations
            .map((r) => new Date(r.arrivalDate))
            .filter((date) => !isNaN(date.getTime()));

        if (validDates.length === 0) {
            alert("No se encontraron fechas válidas.");
            return;
        }

        const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
        const maxDate = new Date(Math.max(...validDates.map((d) => d.getTime())));
        const reportPeriod = `${minDate.toLocaleDateString(
            "es-ES"
        )} - ${maxDate.toLocaleDateString("es-ES")}`;

        // Flujo del PDF
        let y = 20;
        y = PDFReportHeader({
            doc,
            generatedBy: currentUser,
            generatedAt,
            reportPeriod,
            startY: y,
        });
        y = PDFReservationSummary({
            doc,
            total: filteredReservations.length,
            startY: y,
        });
        y = PDFTotalGuests({
            doc,
            guestsCounts: filteredReservations.map((r) => r.guests),
            startY: y,
        });

        // Habitaciones
        const bedrooms = await getBedrooms();
        const roomTypesCount: Record<string, number> = {};
        bedrooms.forEach((b) => {
            const type = b.typeBedroom || "Desconocido";
            roomTypesCount[type] = (roomTypesCount[type] || 0) + 1;
        });
        y = PDFTopRoomTypes({ doc, roomTypesCount, startY: y });

        // Días de mayor demanda
        PDFHighDemandDays({
            doc,
            arrivalDates: filteredReservations.map((r) => r.arrivalDate),
            startY: y,
        });

        // Guardar PDF
        doc.save(`Reporte_Hotel_Madroño_${now.toISOString().split("T")[0]}.pdf`);
    };

    return (
        <Button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
            size="lg"
        >
            <FileText className="h-5 w-5" />
            PDF
        </Button>
    );
};

export default PDFReportGenerate;
