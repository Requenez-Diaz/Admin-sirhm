"use client";

import Link from "next/link";
import {
    BedDouble,
    Users,
    CheckCircle2,
    ArrowRight,
    Calendar,
} from "lucide-react";
import type { AvailableRoom } from "@/app/actions/bedrooms/getAvailableRooms";
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
                    <Calendar className="h-8 w-8 text-slate-400" />
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
        <div className="space-y-8">
            {/* Cabecera de Resultados Enterprise */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-900 pb-5">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Resultados encontrados ({rooms.length})
                    </h2>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {formatDate(checkIn)} &mdash; {formatDate(checkOut)}
                    </span>
                </div>
            </div>

            {/* Grid de Tarjetas Enterprise */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="group bg-white dark:bg-slate-950 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                        {/* Image Container with Aspect Ratio */}
                        <div className="relative aspect-video overflow-hidden">
                            {room.image ? (
                                <img
                                    src={room.image}
                                    alt={`Habitación ${room.numberBedroom}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-900">
                                    <BedDouble className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                                </div>
                            )}

                            {/* Type Badge */}
                            {room.typeName && (
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-full text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest shadow-sm">
                                        {room.typeName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-6 space-y-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                                        Habitación {room.numberBedroom}
                                    </h3>
                                    <p className="text-xs font-medium text-slate-500 line-clamp-1">
                                        {room.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Desde</span>
                                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        C${room.price.toLocaleString("es-MX")}
                                    </span>
                                </div>
                            </div>

                            {/* Features Row */}
                            <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-900">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                                        <Users className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Capacidad</p>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-none">{room.capacity} Personas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-md">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Estado</p>
                                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">Disponible</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="mt-auto pt-2">
                                <Button
                                    asChild
                                    className="w-full h-11 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-100 dark:hover:text-slate-900 transition-all font-bold rounded-lg group/btn shadow-sm"
                                >
                                    <Link
                                        href={`/dashboard/bookings?action=new&typeName=${encodeURIComponent(room.typeName || '')}&checkIn=${checkIn}&checkOut=${checkOut}`}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <span>RESERVAR AHORA</span>
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
