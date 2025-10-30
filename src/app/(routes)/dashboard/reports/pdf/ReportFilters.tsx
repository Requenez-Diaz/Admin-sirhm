"use client";
import React from "react";

interface ReportFiltersProps {
    month: number;
    year: number;
    onMonthChange: (value: number) => void;
    onYearChange: (value: number) => void;
    onReset: () => void;
}

export default function ReportFilters({
    month,
    year,
    onMonthChange,
    onYearChange,
    onReset,
}: ReportFiltersProps) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center justify-between flex-1 px-5 py-2 bg-white rounded-xl shadow-md border border-gray-100">
                <label className="text-sm font-medium text-gray-700">Mes</label>
                <select
                    value={month}
                    onChange={(e) => onMonthChange(Number(e.target.value))}
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
                    onChange={(e) => onYearChange(Number(e.target.value))}
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
                    onClick={onReset}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-lg text-sm ml-4"
                >
                    ↺ Restablecer
                </button>
            </div>
        </div>
    );
}
