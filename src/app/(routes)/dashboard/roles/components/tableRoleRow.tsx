"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table"; // Importación de Shadcn
import { MoreHorizontal } from "lucide-react";
import { RoleActions } from "./roleActions";

interface RoleRow {
  id: number;
  roleName: string;
  descript: string | null;
}

interface TableRoleRowProps {
  role: RoleRow;
}

export function TableRoleRow({ role }: TableRoleRowProps) {
  return (
    <TableRow
      key={role.id}
      className='hover:bg-muted/30 transition-colors border-b border-border/50 group'
    >
      <TableCell className='px-4 py-3 font-mono font-medium text-slate-500 whitespace-nowrap'>
        #{role.id.toString().padStart(3, "0")}
      </TableCell>
      
      <TableCell className='px-4 py-3 text-slate-900 dark:text-slate-100 text-sm font-medium whitespace-nowrap'>
        {role.roleName}
      </TableCell>
      
      <TableCell className='px-4 py-3 text-slate-600 dark:text-slate-400 text-sm italic whitespace-nowrap'>
        {role.descript || "Sin descripción asignada"}
      </TableCell>

      {/* Celda de Acciones Fija (Sticky) */}
      <TableCell className='sticky right-0 z-10 bg-background/95 backdrop-blur-sm px-4 py-3 text-right shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)] group-hover:bg-muted/50 transition-colors'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-muted'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <RoleActions roleId={role.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}