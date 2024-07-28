import getRole from "@/app/actions/role/get-role";
import { AddRoles } from "@/app/cards/roleCards/add-role";
import { Button } from "@/components/ui/button";
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

export default async function Page() {
  const role = await getRole();
  return (
    <div>
      <Table>
        <TableCaption>Listado de usuarios</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Descripcion del rol</TableHead>
            <TableHead>Status</TableHead>

            <TableHead className='text-right items-center'>
              Acciones
              <AddRoles />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {role.map((roles) => (
            <TableRow key={roles.id}>
              <TableCell className='font-medium'>{roles.id}</TableCell>
              <TableCell>{roles.roleName}</TableCell>
              <TableCell>{roles.descript}</TableCell>
              {/* <TableCell>{roles.status}</TableCell>
              <TableCell className='text-right'>{roles.role}</TableCell> */}
              <TableCell className='text-right flex items-center justify-center'>
                <div className='flex justify-between gap-3 '>
                  <Button variant={"ghost"}>Editar</Button>
                  <Button variant={"destructive"}>Eliminar</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
