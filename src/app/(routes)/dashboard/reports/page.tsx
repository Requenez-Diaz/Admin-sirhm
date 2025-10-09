"use client";
import { useState } from "react";
import ExcelReportGenerator from "./GenerateExcelReport";
import PDFReportGenerate from "./pdf/PDFReportGenerate";

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
          <ExcelReportGenerator month={month} year={year} />
          <PDFReportGenerate month={month} year={year} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center justify-between flex-1 px-5 py-2 bg-white rounded-xl shadow-md border border-gray-100">
          <label className="text-sm font-medium text-gray-700">Mes</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm ml-4"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between flex-1 px-5 py-2 bg-white rounded-xl shadow-md border border-gray-100">
          <label className="text-sm font-medium text-gray-700">Año</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-1 text-sm ml-4"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = currentYear - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center justify-between flex-1 px-5 py-2 bg-white rounded-xl shadow-md border border-gray-100">
          <span className="text-sm font-medium text-gray-700">
            Restablecer Filtros
          </span>
          <button
            onClick={resetFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-lg text-sm ml-4"
          >
            ↺ Restablecer
          </button>
        </div>
      </div>
    </div>
  );
}
