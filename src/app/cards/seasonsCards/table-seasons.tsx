"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CalendarDays, Search, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSeason } from "./add-season";
import { EditSeason } from "./edit-season";
import { DeleteSeason } from "./delete-season";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TableSeasons({ seasons }: { seasons: any[] }) {
  const [search, setSearch] = useState("");
  const [editingSeason, setEditingSeason] = useState<any | null>(null);

  const filtered = useMemo(() => {
    const results = seasons.filter((s) => {
      const matchesSearch =
        s.nameSeason.toLowerCase().includes(search.toLowerCase()) ||
        format(new Date(s.dateStart), "MMMM", { locale: es })
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesSearch;
    });

    results.sort((a, b) => {
      const aStart = new Date(a.dateStart).getTime();
      const bStart = new Date(b.dateStart).getTime();
      if (aStart !== bStart) return aStart - bStart;
      const aEnd = new Date(a.dateEnd).getTime();
      const bEnd = new Date(b.dateEnd).getTime();
      return aEnd - bEnd;
    });

    return results;
  }, [seasons, search]);

  return (
    <div className='p-4 space-y-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='relative flex-1 w-full md:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar por tipo o mes...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9'
          />
        </div>
        <AddSeason seasons={seasons} />
      </div>

      <div className='rounded-xl border shadow-sm overflow-x-auto relative bg-background'>
        <Table className='min-w-full'>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='whitespace-nowrap'>Temporada</TableHead>
              <TableHead className='whitespace-nowrap'>Fecha Inicio</TableHead>
              <TableHead className='whitespace-nowrap'>Fecha Fin</TableHead>
              <TableHead className='sticky right-0 z-20 bg-muted/95 backdrop-blur-sm text-right font-bold shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((season) => (
                <TableRow
                  key={season.id}
                  className='hover:bg-muted/30 transition-colors group'
                >
                  <TableCell className='whitespace-nowrap'>
                    <div className='flex items-center gap-2'>
                      <CalendarDays className='h-4 w-4 text-primary' />
                      <Badge
                        variant={
                          season.nameSeason === "ALTA" ? "default" : "secondary"
                        }
                      >
                        {season.nameSeason}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(season.dateStart), "dd 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell className='whitespace-nowrap'>
                    {format(new Date(season.dateEnd), "dd 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </TableCell>
                  <TableCell className='sticky right-0 z-10 bg-background/95 backdrop-blur-sm text-right shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:bg-muted/50 transition-colors'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        {new Date(season.dateEnd) >=
                          new Date(new Date().setHours(0, 0, 0, 0)) && (
                          <DropdownMenuItem
                            onClick={() => setEditingSeason(season)}
                          >
                            <div className='flex items-center gap-2'>
                              <Pencil className='w-4 h-4' />
                              Editar
                            </div>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='p-0'
                        >
                          <DeleteSeason seasonId={season.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  No se encontraron temporadas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingSeason && (
        <EditSeason
          season={editingSeason}
          seasons={seasons}
          open={!!editingSeason}
          onOpenChange={(open) => !open && setEditingSeason(null)}
          showTrigger={false}
        />
      )}
    </div>
  );
}
