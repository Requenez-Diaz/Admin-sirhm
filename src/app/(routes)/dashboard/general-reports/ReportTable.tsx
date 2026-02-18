"use client";

import React, { useState } from "react";
import Pagination from "../data-table/pagination";
import { Badge } from "@/components/ui/badge";

interface ReservationData {
    id: number;
    fecha: string;
    cliente: string;
    email: string;
    monto: number;
    habitaciones: string;
}

interface ReportTableProps {
    data: ReservationData[];
    metrics: {
        ingresosTotales: number;
        totalReservas: number;
    };
}

export default function ReportTable({ data, metrics }: ReportTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(data.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className='bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden'>
            <div className='px-6 py-4 border-b border-border bg-muted/20'>
                <h3 className='font-bold text-xs uppercase tracking-widest text-muted-foreground'>
                    Detalle de Reservas del Periodo
                </h3>
            </div>
            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-border'>
                    <thead className='bg-muted/50'>
                        <tr className='text-[10px] font-bold uppercase text-muted-foreground tracking-tighter'>
                            <th className='px-6 py-4 text-left w-12'>#</th>
                            <th className='px-6 py-4 text-left'>Fecha Emisión</th>
                            <th className='px-6 py-4 text-left'>Cliente / Usuario</th>
                            <th className='px-6 py-4 text-center'>Habitaciones</th>
                            <th className='px-6 py-4 text-right'>Monto Total</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-border'>
                        {currentItems.map((res: any, index: number) => {
                            const globalIndex = indexOfFirstItem + index + 1;
                            return (
                                <tr
                                    key={res.id}
                                    className='hover:bg-muted/30 transition-colors text-sm group'
                                >
                                    <td className='px-6 py-4 whitespace-nowrap text-muted-foreground font-bold text-xs'>
                                        {globalIndex}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-muted-foreground font-mono text-xs'>
                                        {new Date(res.fecha).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <div className='font-bold text-foreground group-hover:text-primary transition-colors'>
                                            {res.cliente}
                                        </div>
                                        <div className='text-xs text-muted-foreground'>
                                            {res.email}
                                        </div>
                                    </td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className='px-2 py-1 bg-secondary text-secondary-foreground rounded text-[10px] font-black border border-border'>
                                            HAB: {res.habitaciones || "N/A"}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400'>
                                        C${res.monto.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    {data.length > 0 && (
                        <tfoot className='bg-muted/50 border-t-2 border-border'>
                            <tr className='font-black text-xs uppercase tracking-tighter'>
                                <td className='px-6 py-4 text-left' colSpan={2}>
                                    Total Registros
                                </td>
                                <td className='px-6 py-4 text-center'>
                                    <Badge variant="outline" className="font-black bg-background">
                                        {metrics.totalReservas} Reservas
                                    </Badge>
                                </td>
                                <td className='px-6 py-4 text-right' colSpan={2}>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-muted-foreground">Suma Total del Periodo</span>
                                        <span className="text-xl text-primary">
                                            C${metrics.ingresosTotales.toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {data.length === 0 ? (
                <div className='p-16 text-center text-muted-foreground italic'>
                    No existen registros para el rango de fechas proporcionado.
                </div>
            ) : (
                <div className="py-4 border-t border-border">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}
