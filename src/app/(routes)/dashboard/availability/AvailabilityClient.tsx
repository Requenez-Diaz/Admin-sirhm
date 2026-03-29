"use client";

import { useState, useTransition, useEffect } from "react";
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
import { useRouter, useSearchParams } from "next/navigation";

type TypeBedroom = {
  id: number;
  nameType: string;
  description: string;
};

interface Props {
  roomTypes: TypeBedroom[];
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialTypeId?: string;
}

export default function AvailabilityClient({
  roomTypes,
  initialCheckIn,
  initialCheckOut,
  initialTypeId,
}: Props) {
  const router = useRouter();
  const _searchParams = useSearchParams();

  const [checkIn, setCheckIn] = useState(initialCheckIn || "");
  const [checkOut, setCheckOut] = useState(initialCheckOut || "");
  const [typeId, setTypeId] = useState(initialTypeId || "all");
  const [results, setResults] = useState<AvailableRoom[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCheckIn && initialCheckOut) {
      handleSearch();
    }
  }, []);

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
        typeId !== "all" ? Number(typeId) : undefined,
      );

      startTransition(() => {
        setResults(data);
        setSearched(true);
      });

      const params = new URLSearchParams();
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      if (typeId && typeId !== "all") params.set("typeId", typeId);

      router.replace(`?${params.toString()}`, { scroll: false });
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
    router.replace("?", { scroll: false });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className='p-8 space-y-10 max-w-6xl mx-auto'>
      {/* CABECERA ENTERPRISE */}
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2 text-blue-600 mb-1'>
            <CalendarSearch className='h-5 w-5' />
            <span className='text-xs font-bold uppercase tracking-widest'>
              Buscador
            </span>
          </div>
          <h1 className='text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight'>
            Disponibilidad de Habitaciones
          </h1>
          <p className='text-slate-500 text-sm'>
            Gestione y consulte el inventario de habitaciones disponibles en
            tiempo real.
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS ENTERPRISE */}
      <div className='bg-white dark:bg-slate-950 rounded-xl border shadow-sm overflow-hidden'>
        <div className='p-6'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 items-end'>
            <div className='space-y-2'>
              <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Fecha de Entrada
              </label>
              <Input
                type='date'
                min={todayStr}
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (checkOut && e.target.value >= checkOut) setCheckOut("");
                }}
                className='h-11 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Fecha de Salida
              </label>
              <Input
                type='date'
                min={checkIn || todayStr}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className='h-11 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium'
              />
            </div>

            <div className='space-y-2'>
              <label className='text-xs font-semibold text-slate-500 uppercase tracking-wider'>
                Categoría
              </label>
              <Select value={typeId} onValueChange={setTypeId}>
                <SelectTrigger className='h-11 rounded-lg border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-950 transition-all font-medium'>
                  <SelectValue placeholder='Todas' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todas las categorías</SelectItem>
                  {roomTypes.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nameType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='flex gap-2'>
              <Button
                onClick={handleSearch}
                disabled={isPending}
                className='flex-1 h-11 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all font-semibold rounded-lg shadow-sm'
              >
                {isPending ? (
                  <div className='h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2' />
                ) : (
                  <Search className='h-4 w-4 mr-2' />
                )}
                {isPending ? "Buscando..." : "Buscar Disponibilidad"}
              </Button>

              {searched && (
                <Button
                  variant='outline'
                  size='icon'
                  onClick={clearFilters}
                  className='h-11 w-11 rounded-lg border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all'
                >
                  <RotateCcw className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className='px-6 py-3 bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-900/30'>
            <p className='text-xs text-red-600 dark:text-red-400 font-semibold'>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* RESULTADOS */}
      <div className='min-h-[400px]'>
        {searched ? (
          <AvailabilityResults
            rooms={results ?? []}
            checkIn={checkIn}
            checkOut={checkOut}
            isPending={isPending}
          />
        ) : (
          <div className='rounded-xl border border-dashed p-16 flex flex-col items-center justify-center text-center space-y-4 bg-muted/20'>
            <Calendar className='h-12 w-12 text-muted-foreground/30' />
            <div className='space-y-1'>
              <h3 className='font-bold text-lg text-slate-700 dark:text-slate-300'>
                Seleccione un rango de fechas
              </h3>
              <p className='text-sm text-slate-500 max-w-xs mx-auto'>
                Para consultar la disponibilidad de nuestras habitaciones.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
