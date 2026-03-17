import getRole from "@/app/actions/role/get-role";
import { AddRoles } from "@/app/cards/roleCards/add-role";
import { DeleteRole } from "@/app/cards/roleCards/delete-role";
import { EditRole } from "@/app/cards/roleCards/edit-role";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShieldCheck, Fingerprint } from "lucide-react";
import React from "react";

export default async function Page() {
  const role = await getRole();

  return (
    <div className='p-6 space-y-6'>
      {/* CABECERA UNIFICADA */}
      <div className='flex flex-col gap-1'>
        <div className='flex items-center gap-2 text-slate-900 dark:text-slate-100'>
          <ShieldCheck className='h-6 w-6 text-black dark:text-white' />
          <h1 className='text-2xl font-black tracking-tight uppercase'>
            Gestión de Roles
          </h1>
        </div>
        <p className='text-slate-500 text-sm italic'>
          Configura los niveles de acceso y permisos para los usuarios del
          sistema.
        </p>
      </div>

      {/* ACCIONES SUPERIORES */}
      <div className='flex justify-start bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800'>
        <AddRoles />
      </div>

      {/* TABLA ESTILIZADA Y ALINEADA */}
      <div className='rounded-xl border border-border overflow-hidden bg-background shadow-sm'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px] font-bold text-foreground'>
                <div className='flex items-center gap-2'>
                  <Fingerprint className='h-4 w-4 text-slate-400' /> ID
                </div>
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider'>
                Nombre del Rol
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider'>
                Descripción del Rol
              </TableHead>
              <TableHead className='text-right font-bold text-foreground uppercase text-xs tracking-wider'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {role.map((roles) => (
              <TableRow
                key={roles.id}
                className='hover:bg-muted/30 transition-colors border-b border-border/50'
              >
                <TableCell className='font-mono font-medium text-slate-500'>
                  #{roles.id.toString().padStart(3, "0")}
                </TableCell>
                <TableCell>
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-black   dark:bg-white dark:text-black-300 border border-indigo-200 dark:border-indigo-800 uppercase'>
                    {roles.roleName}
                  </span>
                </TableCell>
                <TableCell className='text-slate-600 dark:text-slate-400 text-sm italic'>
                  {roles.descript || "Sin descripción asignada"}
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <EditRole roleId={roles.id} />
                    <DeleteRole roleId={roles.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-center pt-4'>
        <p className='text-[10px] text-muted-foreground uppercase tracking-widest'>
          Total de roles definidos: {role.length}
        </p>
      </div>
    </div>
  );
}
