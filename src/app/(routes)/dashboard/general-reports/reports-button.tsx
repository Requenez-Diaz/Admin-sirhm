"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReservationData {
  id: string;
  fecha: string;
  cliente: string;
  email: string;
  monto: number;
  habitaciones: string;
}

interface ReportButtonsProps {
  data: ReservationData[];
  metrics: {
    ingresosTotales: number;
    tasaOcupacion: string;
    totalReservas: number;
    conteoOcupadas: number;
  };
  startDate?: string;
  endDate?: string;
}

export default function ReportButtons({
  data,
  metrics,
  startDate,
  endDate,
}: ReportButtonsProps) {
  const periodoTexto =
    startDate && endDate ? `${startDate}_al_${endDate}` : "Historico_Completo";

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("REPORTE DE RESERVACIONES", 14, 22);

    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.5);
    doc.line(14, 26, pageWidth - 14, 26);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Periodo: ${periodoTexto.replace(/_/g, " ")}`, 14, 34);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 40);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(
      `INGRESO TOTAL: C$${metrics.ingresosTotales.toLocaleString()}`,
      14,
      48,
    );

    autoTable(doc, {
      startY: 55,
      head: [["Fecha", "Cliente", "Habitaciones", "Monto"]],
      body: [
        ...data.map((r) => [
          new Date(r.fecha).toLocaleDateString(),
          r.cliente,
          r.habitaciones,
          `C$${r.monto.toLocaleString()}`,
        ]),
        [
          {
            content: "TOTAL GENERAL",
            colSpan: 3,
            styles: {
              halign: "right",
              fontStyle: "bold",
              fillColor: [240, 240, 240],
            },
          },
          {
            content: `C$${metrics.ingresosTotales.toLocaleString()}`,
            styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
          },
        ],
      ],
      theme: "grid",
      headStyles: { fillColor: [31, 41, 55], halign: "center" },
      columnStyles: { 0: { cellWidth: 30 }, 3: { halign: "right" } },
      styles: { fontSize: 9 },
    });

    // Descarga directa
    doc.save(`Reporte_Reservas_${periodoTexto}.pdf`);
  };

  return (
    <div className='flex flex-wrap gap-3'>
      {/* BOTÓN DESCARGAR PDF DIRECTO */}
      <Button
        variant='default'
        onClick={generatePDF}
        className='flex gap-2 items-center bg-red-600 hover:bg-red-700 text-white'
      >
        <FileDown className='w-4 h-4' />
        <span>Descargar PDF</span>
      </Button>
    </div>
  );
}
