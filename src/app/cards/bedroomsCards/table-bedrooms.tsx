import React from "react";
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
}

interface TableBedroomsProps {
  bedrooms: Bedroom[];
}

const TableBedrooms: React.FC<TableBedroomsProps> = ({ bedrooms }) => {
  const totalBedrooms = bedrooms.length;

  const statusVariants: Record<string, BadgeProps["variant"]> = {
    true: "success",
    false: "destructive",
  };

  const statusLabels: Record<string, string> = {
    true: "Activo",
    false: "Inactivo",
  };

  return (
    <div className='overflow-x-auto'>
      <div className='flex justify-start mb-4'>
        <AddBedrooms />
      </div>
      <form>
        <Table className='min-w-full'>
          <TableCaption className='text-lg font-semibold my-4'>
            Total habitaciones:{" "}
            <span className='text-black'>{totalBedrooms}</span>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>ID</TableHead>
              <TableHead className='w-[100px]'>Tipo</TableHead>
              <TableHead className='w-[100px]'>Descripción</TableHead>
              <TableHead className='w-[100px]'>Temp. baja</TableHead>
              <TableHead className='w-[100px]'>Temp. alta</TableHead>
              <TableHead className='w-[100px]'>Capacidad</TableHead>
              <TableHead className='w-[100px]'>Estado</TableHead>
              <TableHead className='w-[100px]'>N° Habitación</TableHead>
              <TableHead className='w-[150px] text-right'>
                Fecha de creación
              </TableHead>
              <TableHead className='w-[150px] text-right'>
                Fecha de actualización
              </TableHead>
              <TableHead className='w-[100px] text-right'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bedrooms.map((bedroom, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className='font-medium'>
                  {bedroom.typeBedroom}
                </TableCell>
                <TableCell>{bedroom.description}</TableCell>
                <TableCell>{bedroom.lowSeasonPrice}</TableCell>
                <TableCell>{bedroom.highSeasonPrice}</TableCell>
                <TableCell>{bedroom.capacity}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[bedroom.status.toString()]}>
                    {statusLabels[bedroom.status.toString()]}
                  </Badge>
                </TableCell>
                <TableCell>{bedroom.numberBedroom}</TableCell>
                <TableCell className='text-right'>
                  {new Date(bedroom.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className='text-right'>
                  {new Date(bedroom.updatedAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </TableCell>
                <TableCell className='text-right flex items-center'>
                  <div className='flex justify-between gap-3 mr-2'>
                    <EditBedrooms bedroomId={bedroom.id} />
                    <DeleteBedrooms bedroomsId={bedroom.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

export default TableBedrooms;
