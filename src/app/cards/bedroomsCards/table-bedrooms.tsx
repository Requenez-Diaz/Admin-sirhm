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
import { Season } from "../../(routes)/dashboard/offerts/type";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Bedroom {
  id: number;
  typeBedroom: string;
  description: string;
  lowSeasonPrice: number;
  highSeasonPrice: number;
  status: boolean;
  capacity: number;
  amenities: string[];
  numberBedroom: number;
  seasonsId: number;
  createdAt: Date;
  updatedAt: Date;
  image: string;
  slug: string;
}

interface TableBedroomsProps {
  bedrooms: Bedroom[];
  seasons: Season[];
}

const TableBedrooms: React.FC<TableBedroomsProps> = ({ bedrooms, seasons }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all",
  );
  const [capacityFilter, setCapacityFilter] = useState<number | "">("");

  // Memorizamos el filtrado para rendimiento
  const filteredBedrooms = useMemo(() => {
    return bedrooms.filter((b) => {
      const matchesSearch =
        b.typeBedroom.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase()) ||
        b.numberBedroom.toString().includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : String(b.status) === statusFilter;

      const matchesCapacity =
        capacityFilter === "" ? true : b.capacity === capacityFilter;

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [bedrooms, search, statusFilter, capacityFilter]);

  return (
    <div className='p-4 space-y-6'>
      {/* SECCIÓN SUPERIOR: BOTÓN AGREGAR */}
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-black uppercase tracking-tight'>
          Gestión de Habitaciones
        </h2>
        <AddBedrooms />
      </div>

      {/* BARRA DE FILTROS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Buscar por tipo o número...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-9 bg-background'
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary'
        >
          <option value='all'>Todos los estados</option>
          <option value='true'>Disponibles (Activas)</option>
          <option value='false'>Ocupadas (Confirmadas)</option>
        </select>

        <Input
          type='number'
          placeholder='Filtrar por capacidad...'
          value={capacityFilter}
          onChange={(e) =>
            setCapacityFilter(e.target.value ? Number(e.target.value) : "")
          }
          className='bg-background'
        />
      </div>

      {/* CONTENEDOR DE TABLA */}
      <div className='rounded-xl border border-border bg-card shadow-sm overflow-hidden'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow className='border-border'>
              <TableHead className='w-[80px]'>N°</TableHead>
              <TableHead>Habitación / Tipo</TableHead>
              <TableHead>Precios</TableHead>
              <TableHead className='text-center'>Capacidad</TableHead>
              <TableHead>Estado Actual</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBedrooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center py-20 text-muted-foreground italic'
                >
                  No se encontraron habitaciones con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              filteredBedrooms.map((bedroom) => (
                <TableRow
                  key={bedroom.id}
                  className='hover:bg-muted/30 transition-colors border-border'
                >
                  <TableCell className='font-mono font-bold text-lg'>
                    {bedroom.numberBedroom}
                  </TableCell>

                  <TableCell>
                    <div className='font-bold text-foreground'>
                      {bedroom.typeBedroom}
                    </div>
                    <div className='text-xs text-muted-foreground truncate max-w-[250px]'>
                      {bedroom.description}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className='text-xs'>
                      Baja:{" "}
                      <span className='font-bold text-emerald-600'>
                        ${bedroom.lowSeasonPrice}
                      </span>
                    </div>
                    <div className='text-xs'>
                      Alta:{" "}
                      <span className='font-bold text-orange-600'>
                        ${bedroom.highSeasonPrice}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className='text-center'>
                    <div className='flex items-center justify-center gap-1 font-medium'>
                      <Users className='w-3 h-3' /> {bedroom.capacity}
                    </div>
                  </TableCell>

                  <TableCell>
                    {/* LÓGICA DE BADGE: true=Disponible, false=Ocupado */}
                    <Badge
                      variant={bedroom.status ? "outline" : "default"}
                      className={
                        bedroom.status
                          ? "border-emerald-500 text-emerald-600 bg-emerald-500/10"
                          : "bg-blue-600 text-white border-transparent"
                      }
                    >
                      {bedroom.status ? "● Disponible" : "■ Ocupada"}
                    </Badge>
                  </TableCell>

                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-9 w-9 p-0 hover:bg-muted'
                        >
                          <MoreHorizontal className='h-5 w-5' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-48'>
                        <DropdownMenuLabel>
                          Acciones de Gestión
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='cursor-pointer'
                        >
                          <EditBedrooms bedroom={bedroom} seasons={seasons} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-medium'
                        >
                          <DeleteBedrooms bedroomsId={bedroom.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='text-xs text-muted-foreground text-right italic'>
        * Las habitaciones marcadas como (Ocupadas) se actualizan
        automáticamente al confirmar una reserva.
      </div>
    </div>
  );
};

export default TableBedrooms;
