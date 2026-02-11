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
import { EditBedrooms } from "@/app/cards/bedroomsCards/edit-bedrooms";
import { AddBedrooms } from "@/app/cards/bedroomsCards/add-bedrooms";
import { DeleteBedrooms } from "@/app/cards/bedroomsCards/delete-beedrooms";
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
  Users,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TableBedrooms({ bedrooms, seasons }: any) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return bedrooms.filter((b: any) => {
      const matchesSearch =
        b.typeBedroom.toLowerCase().includes(search.toLowerCase()) ||
        b.numberBedroom.toString().includes(search);
      const matchesStatus =
        statusFilter === "all" ? true : String(b.status) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bedrooms, search, statusFilter]);

  return (
    <div className='p-4 space-y-4'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div className='flex flex-1 gap-2 w-full md:max-w-md'>
          <Input
            placeholder='Buscar por tipo o N°...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className='border rounded-md px-2 text-sm bg-background'
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='all'>Todos</option>
            <option value='true'>Disponibles</option>
            <option value='false'>Ocupadas</option>
          </select>
        </div>
        <AddBedrooms />
      </div>

      <div className='rounded-xl border shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow>
              <TableHead className='w-[80px]'>N° Hab.</TableHead>
              <TableHead>Tipo / Descripción</TableHead>
              <TableHead className='text-center'>Capacidad</TableHead>
              {/* NUEVA COLUMNA DE PRECIOS */}
              <TableHead className='text-center'>
                Tarifas (Baja / Alta)
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((bedroom: any) => (
              <TableRow
                key={bedroom.id}
                className='hover:bg-muted/30 transition-colors'
              >
                <TableCell className='font-mono font-bold text-center'>
                  {bedroom.numberBedroom}
                </TableCell>
                <TableCell>
                  <div className='font-semibold'>{bedroom.typeBedroom}</div>
                  <div className='text-xs text-muted-foreground truncate max-w-[180px]'>
                    {bedroom.description}
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex items-center justify-center gap-1'>
                    <Users className='w-3 h-3 text-muted-foreground' />{" "}
                    {bedroom.capacity}
                  </div>
                </TableCell>

                {/* CELDA DE PRECIOS DINÁMICA */}
                <TableCell className='text-center'>
                  <div className='flex flex-col items-center gap-1'>
                    <div className='flex items-center gap-1 text-emerald-600 font-medium text-sm'>
                      <ArrowDownCircle className='w-3 h-3' />
                      C$
                      {Number(bedroom.lowSeasonPrice).toLocaleString()}
                    </div>
                    <div className='flex items-center gap-1 text-orange-600 font-medium text-sm border-t border-border pt-1'>
                      <ArrowUpCircle className='w-3 h-3' />
                      C$
                      {Number(bedroom.highSeasonPrice).toLocaleString()}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant='outline'
                    className={
                      bedroom.status
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20"
                        : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20"
                    }
                  >
                    {bedroom.status ? "✓ Disponible" : "● Ocupada"}
                  </Badge>
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
                        <EditBedrooms bedroom={bedroom} seasons={seasons} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className='text-destructive'
                      >
                        <DeleteBedrooms bedroomsId={bedroom.id} />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
