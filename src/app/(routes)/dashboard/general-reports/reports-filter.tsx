"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, Eraser } from "lucide-react";

export default function ReportFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const start = formData.get("start") as string;
    const end = formData.get("end") as string;

    const params = new URLSearchParams(searchParams);
    if (start) params.set("start", start);
    else params.delete("start");
    if (end) params.set("end", end);
    else params.delete("end");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleFilter}
      className='flex flex-wrap gap-4 items-end bg-card p-6 rounded-xl border shadow-sm mb-8'
    >
      <div className='space-y-2'>
        <label className='text-sm font-semibold flex items-center gap-2'>
          <CalendarDays className='w-4 h-4' /> Desde
        </label>
        <Input
          type='date'
          name='start'
          defaultValue={searchParams.get("start") || ""}
          className='w-48'
        />
      </div>
      <div className='space-y-2'>
        <label className='text-sm font-semibold flex items-center gap-2'>
          <CalendarDays className='w-4 h-4' /> Hasta
        </label>
        <Input
          type='date'
          name='end'
          defaultValue={searchParams.get("end") || ""}
          className='w-48'
        />
      </div>
      <Button type='submit' variant='success'>
        Aplicar Filtros
      </Button>
      <Button
        type='button'
        variant='destructive'
        onClick={() => router.push(pathname)}
        className='flex gap-2'
      >
        <Eraser className='w-4 h-4' /> Limpiar
      </Button>
    </form>
  );
}
