import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React from "react";
import { AddServices } from "./addServices";
import prisma from "@/lib/db";
import { EditServices } from "./editServices";
import DeleteService from "./deleteService";

async function TableServices() {
    const services = await prisma.services.findMany({});

    return (
        <div className="overflow-x-autoauto">
            <div className="flex justify-start mb-4">
                <AddServices />
            </div>
            <form>
                <Table className="min-w-1full">
                    <TableCaption className="text-lg font-semibold my-4">Listado de Servicios</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[100px]'>ID</TableHead>
                            <TableHead>Servicio</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Precio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service, index) => (
                            <TableRow key={service.id}>
                                <TableCell className='font-medium'>{index + 1}</TableCell>
                                <TableCell>{service.nameService}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>{service.price}</TableCell>
                                <TableCell className='text-right flex items-center justify-center'>
                                    <div className='flex justify-between gap-3'>
                                        <EditServices serviceId={service.id} />
                                        <DeleteService serviceId={service.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </form>

        </div>
    );
}

export default TableServices;