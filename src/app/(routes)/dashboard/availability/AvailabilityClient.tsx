"use client";

import { useState, useTransition } from "react";
import {
    getAvailableRooms,
    type AvailableRoom,
} from "@/app/actions/bedrooms/getAvailableRooms";
import AvailabilityResults from "./AvailabilityResults";
import { Search, Calendar, RotateCcw, CalendarSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type TypeBedroom = {
    id: number;
    nameType: string;
    description: string;
};

interface Props {
    roomTypes: TypeBedroom[];
}

export default function AvailabilityClient({ roomTypes }: Props) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [typeId, setTypeId] = useState<string>("all");
    const [results, setResults] = useState<AvailableRoom[] | null>(null);
    const [searched, setSearched] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        setError(null);

        if (!checkIn || !checkOut) {
            setError("Por favor selecciona fechas de entrada y salida.");
            return;
        }

        const dateIn = new Date(checkIn);
        const dateOut = new Date(checkOut);

        if (dateOut <= dateIn) {
            setError("La fecha de salida debe ser posterior a la fecha de entrada.");
            return;
        }

        try {
            const data = await getAvailableRooms(
                dateIn,
                dateOut,
                typeId !== "all" ? Number(typeId) : undefined
            );

            startTransition(() => {
                setResults(data);
                setSearched(true);
            });
        } catch (err) {
            console.error(err);
            setError("Hubo un error al buscar disponibilidad.");
        }
    };

    const clearFilters = () => {
        setCheckIn("");
        setCheckOut("");
        setTypeId("all");
        setResults(null);
        setSearched(false);
        setError(null);
    };

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <div className="p-4 space-y-6">
            {/* CABECERA ESTILO DASHBOARD */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <CalendarSearch className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-black tracking-tight">
                        Consulta de Disponibilidad
                    </h1>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                    Verifica qué habitaciones están libres para un rango de fechas específico.
                </p>
            </div>

            {/* BARRA DE FILTROS ESTILO DASHBOARD */}
            <div className="rounded-xl border shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Entrada</label>
                        <Input
                            type="date"
                            min={todayStr}
                            value={checkIn}
                            onChange={(e) => {
                                setCheckIn(e.target.value);
                                if (checkOut && e.target.value >= checkOut) setCheckOut("");
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Salida</label>
                        <Input
                            type="date"
                            min={checkIn || todayStr}
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Categoría</label>
                        <Select value={typeId} onValueChange={setTypeId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todas las habitaciones" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las habitaciones</SelectItem>
                                {roomTypes.map((t) => (
                                    <SelectItem key={t.id} value={String(t.id)}>
                                        {t.nameType}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={handleSearch}
                            disabled={isPending}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {isPending ? "Buscando..." : "Buscar"}
                        </Button>

                        {searched && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={clearFilters}
                                className="text-slate-500 hover:text-slate-900"
                            >
                                <RotateCcw className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {error && (
                    <p className="text-xs text-red-500 font-bold">{error}</p>
                )}
            </div>

            {/* RESULTADOS */}
            <div className="min-h-[400px]">
                {searched ? (
                    <AvailabilityResults
                        rooms={results ?? []}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        isPending={isPending}
                    />
                ) : (
                    <div className="rounded-xl border border-dashed p-16 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20">
                        <Calendar className="h-12 w-12 text-muted-foreground/30" />
                        <div className="space-y-1">
                            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300">
                                Seleccione un rango de fechas
                            </h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                Para consultar la disponibilidad de nuestras habitaciones.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
