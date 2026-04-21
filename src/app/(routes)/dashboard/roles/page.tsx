import getRole from "@/app/actions/role/get-role";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { Fingerprint } from "lucide-react";
import React from "react";
import {
  TableRoleHeader,
  TableRoleActions,
  TableRoleRow,
  TableRoleFooter,
  TableRoleEmptyState,
} from "./components";

export default async function Page() {
  const role = await getRole();

  return (
    <div className='p-6 space-y-6'>
      <TableRoleHeader />
      <TableRoleActions />

      {/* Contenedor con scroll horizontal y relativo para el sticky */}
      <div className='rounded-xl border border-border overflow-x-auto relative bg-background shadow-sm'>
        <Table className='min-w-full'>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px] font-bold text-foreground whitespace-nowrap'>
                <div className='flex items-center gap-2'>
                  <Fingerprint className='h-4 w-4 text-slate-400' /> ID
                </div>
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider whitespace-nowrap'>
                Nombre del Rol
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider whitespace-nowrap'>
                Descripción del Rol
              </TableHead>

              {/* Encabezado de Acciones Fijo */}
              <TableHead className='sticky right-0 z-20 bg-muted/95 backdrop-blur-sm text-right font-bold text-foreground uppercase text-xs tracking-wider shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {role.length > 0 ? (
              role.map((roles) => <TableRoleRow key={roles.id} role={roles} />)
            ) : (
              <TableRoleEmptyState />
            )}
          </TableBody>
        </Table>
      </div>

      <TableRoleFooter totalCount={role.length} />
    </div>
  );
}
