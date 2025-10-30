"use client";
import { useState } from "react";
import PDFReportGenerate from "./pdf/PDFReportGenerate";
import ReportFilters from "./pdf/ReportFilters";

export default function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const resetFilters = () => {
    setMonth(currentMonth);
    setYear(currentYear);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
        Reportes de Reservas
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between w-full px-5 py-2 bg-white rounded-xl shadow-md border border-gray-100">
        <h2 className="text-base font-medium text-gray-800">
          Opciones de Exportación
        </h2>
        <div className="flex items-center gap-3 mt-2 md:mt-0">
          <PDFReportGenerate month={month} year={year} />
        </div>
      </div>

      <ReportFilters
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onReset={resetFilters}
      />
    </div>
  );
}
