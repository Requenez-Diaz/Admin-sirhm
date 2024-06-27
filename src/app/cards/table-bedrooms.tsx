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
import { saveBedrooms } from "@/app/actions/reservations";
import { AddBedrooms } from "@/app/cards/add-bedrooms";
import { DeleteBedrooms } from "@/app/cards/delete-beedrooms";


async function TableBedrooms() {
    const bedrooms = await prisma.bedrooms.findMany();

    return (
        <div>
            <form action={saveBedrooms}>
                <Table>
                    <TableCaption>Listado de habitaciones</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[100px]'>ID</TableHead>
                            <TableHead className='w-[100px]'>Habitaciones </TableHead>
                            <TableHead className='w-[100px]'>Descripcion </TableHead>
                            <TableHead className='w-[100px]'>Temporada baja</TableHead>
                            <TableHead className='w-[100px]'>Temporada alta</TableHead>
                            <TableHead className='w-[100px]'>Estado</TableHead>
                            <TableHead className='w-[100px]'>Numero de habitacion</TableHead>
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
                                <TableCell>{bedroom.status}</TableCell>
                                <TableCell>{bedroom.numberBedroom}</TableCell>
                                <TableCell className='text-right flex items-center justify-center'>
                                    <div className='flex justify-between gap-3'>
                                        <EditBedrooms />
                                        <DeleteBedrooms />
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