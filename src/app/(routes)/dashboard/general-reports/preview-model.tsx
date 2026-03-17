"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Eye, FileDown } from "lucide-react";
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
  periodo: string;
}

export default function ReportPreview({ data, metrics, periodo }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePreview = () => {
    const doc = new jsPDF();

    // --- Lógica del PDF (Igual a la de descarga) ---
    doc.setFontSize(18);
    doc.text("REPORTE FINANCIERO DE RESERVACIONES", 14, 20);
    doc.setFontSize(10);
    doc.text(`Periodo: ${periodo}`, 14, 28);
    doc.text(
      `Ingreso Total: C$${metrics.ingresosTotales.toLocaleString()}`,
      14,
      34,
    );

    autoTable(doc, {
      startY: 40,
      head: [["Cliente", "Email", "Ingresos", "Hab."]],
      body: [
        ...data.map((r) => [
          r.Cliente,
          r.Email,
          `C$${r.Total_Gastado.toLocaleString()}`,
          r.Hab_Ocupadas,
        ]),
        [
          {
            content: "TOTAL",
            colSpan: 2,
            styles: { halign: "right", fontStyle: "bold" },
          },
          {
            content: `C$${metrics.ingresosTotales.toLocaleString()}`,
            styles: { fontStyle: "bold" },
          },
          "",
        ],
      ],
    });

    const blob = doc.output("bloburl");
    setPdfUrl(blob as unknown as string);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          onClick={generatePreview}
          className='flex gap-2'
        >
          <Eye className='w-4 h-4' /> Previsualizar PDF
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl h-[90vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='flex justify-between items-center'>
            Vista Previa del Documento
            <Button
              size='sm'
              onClick={() => {
                const link = document.createElement("a");
                link.href = pdfUrl!;
                link.download = `Reporte_${periodo}.pdf`;
                link.click();
              }}
              className='bg-red-600 mr-8'
            >
              <FileDown className='w-4 h-4 mr-2' /> Descargar Ahora
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className='flex-1 w-full bg-muted rounded-md overflow-hidden border'>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className='w-full h-full'
              title='PDF Preview'
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              Cargando previsualización...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
