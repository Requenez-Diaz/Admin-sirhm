import prisma from '@/lib/db';

import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EditBedrooms } from "@/app/cards/edit-bedrooms";
import { AddBedrooms } from "@/app/cards/add-bedrooms";
import { DeleteBedrooms } from "@/app/cards/delete-beedrooms";
import { Badge, BadgeProps } from "@/components/ui/badge";


async function TableBedrooms() {
    const bedrooms = await prisma.bedrooms.findMany({
        orderBy: {
            numberBedroom: 'asc',
        },
    });
    const totalBedrooms = bedrooms.length;

    const statusVariants: Record<string, BadgeProps['variant']> = {
        "true": "success",
        "false": "destructive",
    };

    const statusLabels: Record<string, string> = {
        "true": "Activo",
        "false": "Inactivo",
    };

    return (
        <div className='overflow-x-auto'>
            <form>
                <Table className='min-w-full'>
                    <TableCaption className="text-lg font-semibold my-4">
                        Total habitaciones: <span className="text-black">{totalBedrooms}</span>
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[50px]'>ID</TableHead>
                            <TableHead className='w-[100px]'>Tipo </TableHead>
                            <TableHead className='w-[100px]'>Descripcion </TableHead>
                            <TableHead className='w-[100px]'>Temp. baja</TableHead>
                            <TableHead className='w-[100px]'>Temp. alta</TableHead>
                            <TableHead className='w-[100px]'>Estado</TableHead>
                            <TableHead className='w-[50px]'>N°</TableHead>
                            <TableHead className='w-[100px]'>Acciones
                            <AddBedrooms />
                            </TableHead>
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
                                <TableCell>
                                    <Badge variant={statusVariants[bedroom.status.toString()]}>
                                        {statusLabels[bedroom.status.toString()]}
                                    </Badge>
                                </TableCell>
                                <TableCell>{bedroom.numberBedroom}</TableCell>
                                <TableCell className='text-right flex items-center'>
                                    <div className='flex justify-between gap-3'>
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