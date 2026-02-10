"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, Table as TableIcon, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const periodoTexto =
    startDate && endDate ? `${startDate} al ${endDate}` : "Histórico Completo";

  // Función núcleo para generar el documento PDF
  const generatePDF = (mode: "download" | "preview") => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- Diseño del PDF ---
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41);
    doc.text("REPORTE DE RESERVACIONES", 14, 22);

    // Línea decorativa
    doc.setDrawColor(31, 41, 55);
    doc.setLineWidth(0.5);
    doc.line(14, 26, pageWidth - 14, 26);

    // Metadatos
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Periodo: ${periodoTexto}`, 14, 34);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 40);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(
      `INGRESO TOTAL: C$${metrics.ingresosTotales.toLocaleString()}`,
      14,
      48,
    );

    // Tabla de datos
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
        // Fila de Totales
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
      columnStyles: {
        0: { cellWidth: 30 },
        3: { halign: "right" },
      },
      styles: { fontSize: 9 },
    });

    if (mode === "download") {
      doc.save(`Reporte_Reservas_${periodoTexto.replace(/ /g, "_")}.pdf`);
    } else {
      const blob = doc.output("bloburl");
      setPdfUrl(blob as unknown as string);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      data.map((r) => ({
        Fecha: new Date(r.fecha).toLocaleString(),
        Cliente: r.cliente,
        Email: r.email,
        Habitaciones: r.habitaciones,
        Monto: r.monto,
      })),
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservaciones");
    XLSX.writeFile(wb, `Reporte_Hotel_${periodoTexto.replace(/ /g, "_")}.xlsx`);
  };

  return (
    <div className='flex flex-wrap gap-3'>
      {/* MODAL DE PREVISUALIZACIÓN */}
      <Dialog onOpenChange={(open) => !open && setPdfUrl(null)}>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            onClick={() => generatePDF("preview")}
            className='flex gap-2 items-center'
          >
            <Eye className='w-4 h-4' />
            <span className='hidden sm:inline'>Previsualizar</span>
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl'>
          <DialogHeader className='p-4 bg-background border-b flex flex-row items-center justify-between space-y-0'>
            <DialogTitle className='text-xl font-bold flex items-center gap-2'>
              <Printer className='w-5 h-5' /> Vista Previa del Reporte
            </DialogTitle>
            <div className='flex items-center gap-2 pr-8'>
              <Button
                size='sm'
                variant='destructive'
                onClick={() => generatePDF("download")}
              >
                <FileDown className='w-4 h-4 mr-2' />
                Descargar
              </Button>
            </div>
          </DialogHeader>
          <div className='flex-1 bg-slate-100 dark:bg-slate-950 p-4'>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className='w-full h-full rounded shadow-inner'
                title='PDF Preview'
              />
            ) : (
              <div className='flex items-center justify-center h-full text-muted-foreground animate-pulse'>
                Generando documento...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* BOTÓN EXCEL */}
      <Button
        variant='outline'
        onClick={exportToExcel}
        className='flex gap-2 items-center border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
      >
        <TableIcon className='w-4 h-4' />
        <span className='hidden sm:inline'>Exportar Excel</span>
      </Button>
    </div>
  );
}
