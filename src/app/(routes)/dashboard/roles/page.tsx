import getRole from "@/app/actions/role/get-role";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <tbody>
            {role.length > 0 ? (
              role.map((roles) => <TableRoleRow key={roles.id} role={roles} />)
            ) : (
              <TableRoleEmptyState />
            )}
          </tbody>
        </Table>
      </div>

      <TableRoleFooter totalCount={role.length} />
    </div>
  );
}
