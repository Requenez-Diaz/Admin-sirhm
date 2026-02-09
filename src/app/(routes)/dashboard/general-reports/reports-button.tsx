"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, Table as TableIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  data: any[];
  metrics: any;
  startDate?: string;
  endDate?: string;
}

export default function ReportButtons({
  data,
  metrics,
  startDate,
  endDate,
}: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const periodo =
    startDate && endDate ? `${startDate} al ${endDate}` : "Histórico Completo";

  const generatePDF = (output: "save" | "preview") => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Encabezado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("REPORTE FINANCIERO DE RESERVACIONES", 14, 20);

    doc.setLineWidth(0.5);
    doc.line(14, 25, pageWidth - 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generado por: Administrador del Sistema`, 14, 32);
    doc.text(`Periodo: ${periodo}`, 14, 38);
    doc.text(
      `Ingreso Total: $${metrics.ingresosTotales.toLocaleString()}`,
      14,
      44,
    );

    autoTable(doc, {
      startY: 52,
      head: [["Cliente", "Email", "Ingresos", "Habitaciones", "Reservas"]],
      body: [
        ...data.map((r) => [
          r.Cliente,
          r.Email,
          `$${r.Total_Gastado.toLocaleString()}`,
          r.Hab_Ocupadas,
          r.Frecuencia,
        ]),
        [
          {
            content: "TOTAL DEL PERIODO",
            colSpan: 2,
            styles: {
              halign: "right",
              fontStyle: "bold",
              fillColor: [240, 240, 240],
            },
          },
          {
            content: `$${metrics.ingresosTotales.toLocaleString()}`,
            styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
          },
          {
            content: `${metrics.conteoOcupadas} Hab.`,
            styles: { fontStyle: "bold", fillColor: [240, 240, 240] },
          },
          { content: "-", styles: { fillColor: [240, 240, 240] } },
        ],
      ],
      headStyles: { fillColor: [31, 41, 55] },
      theme: "grid",
    });

    if (output === "save") {
      doc.save(`Reporte_${periodo.replace(/ /g, "_")}.pdf`);
    } else {
      const blob = doc.output("bloburl");
      setPdfUrl(blob as unknown as string);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, `Reporte_${periodo}.xlsx`);
  };

  return (
    <div className='flex gap-2'>
      {/* Modal de Previsualización */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            onClick={() => generatePDF("preview")}
            className='flex gap-2'
          >
            <Eye className='w-4 h-4' /> Previsualizar
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-4xl h-[90vh]'>
          <DialogHeader>
            <DialogTitle className='flex justify-between items-center pr-8'>
              Vista Previa del Reporte
              <Button
                size='sm'
                onClick={() => generatePDF("save")}
                className='bg-red-600'
              >
                <FileDown className='w-4 h-4 mr-2' /> Descargar PDF
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className='flex-1 w-full border rounded-md overflow-hidden bg-gray-100'>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className='w-full h-full'
                title='PDF Preview'
              />
            ) : (
              <div className='flex items-center justify-center h-full'>
                Cargando PDF...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={exportToExcel}
        variant='outline'
        className='text-green-600 border-green-600 hover:bg-green-50'
      >
        <TableIcon className='w-4 h-4 mr-2' /> Excel
      </Button>
    </div>
  );
}
