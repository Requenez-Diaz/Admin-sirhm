"use client";

import Link from "next/link";
import {
    BedDouble,
    Users,
    CalendarX2,
    CheckCircle2,
    ArrowRight,
    ArrowDownCircle,
} from "lucide-react";
import type { AvailableRoom } from "@/app/actions/bedrooms/getAvailableRooms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
    rooms: AvailableRoom[];
    checkIn: string;
    checkOut: string;
    isPending: boolean;
}

function formatDate(dateStr: string) {
    return new Date(dateStr + "T12:00:00").toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
    });
}

export default function AvailabilityResults({
    rooms,
    checkIn,
    checkOut,
    isPending,
}: Props) {
    if (isPending) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card p-4 space-y-4 animate-pulse shadow-sm"
                    >
                        <div className="h-44 rounded-lg bg-muted" />
                        <div className="h-5 rounded bg-muted w-2/3" />
                        <div className="h-4 rounded bg-muted w-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <CalendarX2 className="h-8 w-8 text-slate-400" />
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">No hay disponibilidad</p>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                        Prueba otro rango de fechas o una categoría distinta.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Resumen Superior */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                            {rooms.length} Disponibles
                        </span>
                    </div>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                    {formatDate(checkIn)} — {formatDate(checkOut)}
                </div>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="group flex flex-col bg-card rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                        {/* Imagen */}
                        <div className="relative h-48 overflow-hidden bg-muted">
                            {room.image ? (
                                <img
                                    src={room.image}
                                    alt={`Habitación ${room.numberBedroom}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <BedDouble className="h-10 w-10 text-slate-300" />
                                </div>
                            )}

                            {/* Categoría Badge */}
                            {room.typeName && (
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-none font-bold uppercase text-[10px] tracking-widest px-2.5 py-0.5 shadow-sm">
                                        {room.typeName}
                                    </Badge>
                                </div>
                            )}

                            {/* Número Habitación */}
                            <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter mr-1">N°</span>
                                <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none">
                                    {room.numberBedroom}
                                </span>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-5 flex flex-col flex-1 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-slate-500 line-clamp-2 italic font-medium">
                                    &quot;{room.description}&quot;
                                </p>
                            </div>

                            {/* Specs Grid Estilo Panel */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Capacidad</p>
                                    <p className="text-sm font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                        <Users className="h-3.5 w-3.5 text-blue-600" />
                                        {room.capacity} Personas
                                    </p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tarifa Base</p>
                                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                                        <ArrowDownCircle className="w-3.5 h-3.5" />
                                        C${room.lowSeasonPrice.toLocaleString("es-MX")}
                                    </div>
                                </div>
                            </div>

                            {/* Botón Acción Estilo Dash */}
                            <div className="mt-auto pt-2">
                                <Button
                                    asChild
                                    className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-colors font-bold rounded-lg group/btn"
                                >
                                    <Link href="/dashboard/bookings" className="flex items-center justify-between px-4">
                                        <span>Procesar Reserva</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
