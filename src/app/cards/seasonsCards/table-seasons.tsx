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
import {
    MoreHorizontal,
    CalendarDays,
    Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddSeason } from "./add-season";
import { EditSeason } from "./edit-season";
import { DeleteSeason } from "./delete-season";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function TableSeasons({ seasons }: { seasons: any[] }) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        return seasons.filter((s) => {
            const matchesSearch =
                s.nameSeason.toLowerCase().includes(search.toLowerCase()) ||
                format(new Date(s.dateStart), "MMMM", { locale: es }).toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [seasons, search]);

    return (
        <div className='p-4 space-y-4'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div className='relative flex-1 w-full md:max-w-md'>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder='Buscar por tipo o mes...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <AddSeason />
            </div>

            <div className='rounded-xl border shadow-sm overflow-hidden'>
                <Table>
                    <TableHeader className='bg-muted/50'>
                        <TableRow>
                            <TableHead>Temporada</TableHead>
                            <TableHead>Fecha Inicio</TableHead>
                            <TableHead>Fecha Fin</TableHead>
                            <TableHead className='text-right'>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length > 0 ? (
                            filtered.map((season) => (
                                <TableRow
                                    key={season.id}
                                    className='hover:bg-muted/30 transition-colors'
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-primary" />
                                            <span className="font-semibold">{season.nameSeason}</span>
                                            <Badge
                                                variant={season.nameSeason === 'ALTA' ? 'default' : 'secondary'}
                                                className="ml-2"
                                            >
                                                {season.nameSeason}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(season.dateStart), "dd 'de' MMMM, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(season.dateEnd), "dd 'de' MMMM, yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' size='icon'>
                                                    <MoreHorizontal className='h-4 w-4' />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end' className='w-40'>
                                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                    <EditSeason season={season} />
                                                </DropdownMenuItem>
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
                                <TableCell colSpan={4} className="h-24 text-center">
                                    No se encontraron temporadas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
