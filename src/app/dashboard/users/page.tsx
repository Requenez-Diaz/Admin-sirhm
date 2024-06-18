import { DeleteUsers } from "@/app/cards/delete-users";
import { EditUsers } from "@/app/cards/edit-user";
import { Button } from "@/components/ui/button";
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
import { Delete } from "lucide-react";
import React from "react";

export default function Page() {
  const users = [
    {
      id: 1,
      username: "admin",
      email: "admin@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      username: "user",
      email: "admin@gmail.com",
      role: "User",
      status: "Active",
    },
    {
      id: 3,
      username: "guest",
      email: "admin@gmail.com",
      role: "Guest",
      status: "Active",
    },
    {
      id: 4,
      username: "disabled",
      email: "admin@gmail.com",
      role: "User",
      status: "Disabled",
    },
  ];
  return (
    <div>
      <Table>
        <TableCaption>Listado de usuarios</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID </TableHead>
            <TableHead>Usuarios</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Role</TableHead>
            <TableHead className='text-right items-center'>
              Acciones
              <Button variant={"ghost"} className='mr-4'>
                Agregar usuario
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((bedroom) => (
            <TableRow key={bedroom.id}>
              <TableCell className='font-medium'>{bedroom.id}</TableCell>
              <TableCell>{bedroom.username}</TableCell>
              <TableCell>{bedroom.email}</TableCell>
              <TableCell>{bedroom.status}</TableCell>
              <TableCell className='text-right'>{bedroom.role}</TableCell>
              <TableCell className='text-right flex items-center justify-center'>
                <div className='flex justify-between gap-3 '>
                  <EditUsers />
                  <DeleteUsers />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
