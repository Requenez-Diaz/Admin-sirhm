import findManyUsers from "@/app/actions/users/get-users";
import { DeleteUsers } from "@/app/cards/usersCards/delete-users";
import { EditUsers } from "@/app/cards/usersCards/edit_users";
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
  console.log("Users: ", users);

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
            <TableHead>Contraseña</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Acciones</TableHead>
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
                <TableCell>{user.roleName}</TableCell>

                <TableCell>
                  <div className='flex flex-row items-center'>
                    <EditUsers userId={user.id} />
                    <DeleteUsers userId={user.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
