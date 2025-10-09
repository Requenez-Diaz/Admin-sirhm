"use client";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { getReservations } from "@/app/actions/reservation";
import { getBedrooms } from "@/app/actions/bedrooms";
import PDFReportHeader from "./PdfReportHeader";
import PDFReservationSummary from "./PDFReservationSummary";
import PDFTopRoomTypes from "./PDFTopRoomTypes";
import PDFTotalGuests from "./PDFTotalGuests";
import PDFHighDemandDays from "./PDFHighDemandDays";
import PDFReservationComparisonRender from "./PDFReservationComparison";
import PDFEstimatedIncome from "./PDFEstimatedIncome";
import { useSession } from "next-auth/react";

interface Bedroom {
  typeBedroom: string;
  price: number;
}

interface PDFReportGenerateProps {
  month: number;
  year: number;
}

const PDFReportGenerate: React.FC<PDFReportGenerateProps> = ({ month, year }) => {
  const [reservations, setReservations] = useState<Awaited<ReturnType<typeof getReservations>>>([]);
  const { data: session } = useSession();

  const currentUser =
    session?.user?.role === "Admin"
      ? session?.user?.name || "Administrador"
      : "Usuario no autorizado";

  useEffect(() => {
    (async () => {
      try {
        const data = await getReservations();
        setReservations(data);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      }
    })();
  }, []);

  const generatePDF = async () => {
    if (currentUser === "Usuario no autorizado") {
      alert("Solo los administradores pueden generar reportes.");
      return;
    }

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

    const validDates = filteredReservations
      .map((r) => new Date(r.arrivalDate))
      .filter((date) => !isNaN(date.getTime()));

    const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...validDates.map((d) => d.getTime())));
    const reportPeriod = `${minDate.toLocaleDateString("es-ES")} - ${maxDate.toLocaleDateString("es-ES")}`;

    let _y = 20;

    _y = PDFReportHeader({
      doc,
      generatedBy: currentUser,
      generatedAt,
      reportPeriod,
      startY: _y,
    });

    _y = PDFReservationSummary({
      doc,
      total: filteredReservations.length,
      startY: _y,
    });

    _y = PDFTotalGuests({
      doc,
      guestsCounts: filteredReservations.map((r) => r.guests),
      startY: _y,
    });

    const bedroomsData = await getBedrooms();
    const roomTypesCount: Record<string, number> = {};
    bedroomsData.forEach((b) => {
      const type = b.typeBedroom || "Desconocido";
      roomTypesCount[type] = (roomTypesCount[type] || 0) + 1;
    });

    _y = PDFTopRoomTypes({ doc, roomTypesCount, startY: _y });

    _y = PDFHighDemandDays({
      doc,
      arrivalDates: filteredReservations.map((r) => r.arrivalDate),
      startY: _y,
    });

    _y = PDFReservationComparisonRender({
      doc,
      reservations,
      month,
      year,
      startY: _y,
    });

    const mappedBedrooms: Bedroom[] = bedroomsData.map((b) => ({
      typeBedroom: b.typeBedroom,
      price: b.lowSeasonPrice,
    }));

    _y = PDFEstimatedIncome({
      doc,
      reservations: filteredReservations,
      bedrooms: mappedBedrooms,
      startY: _y,
    });

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
