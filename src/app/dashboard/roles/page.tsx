import getRole from "@/app/actions/role/get-role";
import { AddRoles } from "@/app/cards/roleCards/add-role";
import { DeleteRole } from "@/app/cards/roleCards/delete-role";
import { EditRole } from "@/app/cards/roleCards/edit-role";

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
    <div className=''>
      <AddRoles />
      <Table className='w-screen'>
        <TableCaption>Listado de usuarios</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100x]'>ID </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Descripcion del rol</TableHead>
            <TableHead>Acciones</TableHead>
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
              <TableCell>
                <EditRole roleId={roles.id} />
                <DeleteRole roleId={roles.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
