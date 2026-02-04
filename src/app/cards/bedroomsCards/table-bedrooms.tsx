"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditBedrooms } from "@/app/cards/bedroomsCards/edit-bedrooms";
import { AddBedrooms } from "@/app/cards/bedroomsCards/add-bedrooms";
import { DeleteBedrooms } from "@/app/cards/bedroomsCards/delete-beedrooms";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Season } from "../../(routes)/dashboard/offerts/type";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal} from "lucide-react";
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

  const statusVariants: Record<string, BadgeProps["variant"]> = {
    true: "success",
    false: "destructive",
  };

  const statusLabels: Record<string, string> = {
    true: "Activo",
    false: "Inactivo",
  };

  const filteredBedrooms = useMemo(() => {
    return bedrooms.filter((b) => {
      const matchesSearch =
        b.typeBedroom.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : String(b.status) === statusFilter;
      const matchesCapacity =
        capacityFilter === "" ? true : b.capacity === capacityFilter;

      return matchesSearch && matchesStatus && matchesCapacity;
    });
  }, [bedrooms, search, statusFilter, capacityFilter]);

  return (
    <div className='overflow-x-auto p-4'>
      <div className='flex justify-start mb-6'>
        <AddBedrooms />
      </div>

      {/* FILTROS CON ESTILO ADAPTABLE */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <Input
          placeholder='Buscar tipo o descripción...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='bg-background'
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "true" | "false")
          }
          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
        >
          <option value='all'>Todos los estados</option>
          <option value='true'>Activo</option>
          <option value='false'>Inactivo</option>
        </select>

        <Input
          type='number'
          placeholder='Capacidad'
          value={capacityFilter}
          onChange={(e) =>
            setCapacityFilter(e.target.value ? Number(e.target.value) : "")
          }
          className='bg-background'
        />
      </div>

      {/* TABLA CON BORDES Y CABECERA CORREGIDA */}
      <div className='rounded-md border border-border overflow-hidden'>
        <Table>
          <TableCaption className='text-sm font-medium my-4 text-muted-foreground'>
            Total habitaciones filtradas:{" "}
            <span className='text-foreground font-bold'>
              {filteredBedrooms.length}
            </span>
          </TableCaption>

          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent border-border'>
              <TableHead className='text-foreground font-bold py-4'>
                ID
              </TableHead>
              <TableHead className='text-foreground font-bold'>Tipo</TableHead>
              <TableHead className='text-foreground font-bold'>
                Descripción
              </TableHead>
              <TableHead className='text-foreground font-bold'>
                P. Baja
              </TableHead>
              <TableHead className='text-foreground font-bold'>
                P. Alta
              </TableHead>
              <TableHead className='text-foreground font-bold text-center'>
                Cap.
              </TableHead>
              <TableHead className='text-foreground font-bold'>
                Estado
              </TableHead>
              <TableHead className='text-foreground font-bold text-center'>
                N°
              </TableHead>
              <TableHead className='text-right text-foreground font-bold'>
                Creado
              </TableHead>
              <TableHead className='text-right text-foreground font-bold'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredBedrooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className='text-center py-12 text-muted-foreground'
                >
                  No se encontraron habitaciones.
                </TableCell>
              </TableRow>
            ) : (
              filteredBedrooms.map((bedroom, index) => (
                <TableRow key={bedroom.id} className='border-border'>
                  <TableCell className='font-medium text-muted-foreground'>
                    {index + 1}
                  </TableCell>
                  <TableCell className='font-semibold'>
                    {bedroom.typeBedroom}
                  </TableCell>
                  <TableCell className='max-w-[200px] truncate'>
                    {bedroom.description}
                  </TableCell>
                  <TableCell>${bedroom.lowSeasonPrice}</TableCell>
                  <TableCell>${bedroom.highSeasonPrice}</TableCell>
                  <TableCell className='text-center'>
                    {bedroom.capacity}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariants[String(bedroom.status)]}>
                      {statusLabels[String(bedroom.status)]}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center font-mono'>
                    {bedroom.numberBedroom}
                  </TableCell>
                  <TableCell className='text-right text-xs text-muted-foreground'>
                    {new Date(bedroom.createdAt).toLocaleDateString("es-ES")}
                  </TableCell>

                  {/* ACCIONES ESTILO DROPDOWN */}
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          className='h-8 w-8 p-0 hover:bg-muted'
                        >
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-40'>
                        <DropdownMenuLabel>Gestión</DropdownMenuLabel>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='cursor-pointer'
                        >
                          <EditBedrooms bedroom={bedroom} seasons={seasons} />
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className='cursor-pointer text-destructive focus:text-destructive'
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
    </div>
  );
};

export default TableBedrooms;
