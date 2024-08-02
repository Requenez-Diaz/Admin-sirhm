import findManyUsers from "@/app/actions/users/get-users";
import { DeleteUsers } from "@/app/cards/delete-users";
import { EditUsers } from "@/app/cards/edit-user";
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
  const users = await findManyUsers();

  const totalUsers = users.length;
  return (
    <div>
      <Table>
        <TableCaption>Listado de usuarios: {totalUsers}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID </TableHead>
            <TableHead>Usuarios</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Role</TableHead>
            <TableHead className=' text-right items-center '>
              Acciones
              <Button variant={"ghost"}>Agregar usuario</Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users &&
            users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.password}</TableCell>

                <TableCell>
                  <EditUsers />
                  <DeleteUsers />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
