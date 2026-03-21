"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { UserActions } from "./userActions";

interface UserRow {
  id: number;
  username: string;
  email: string;
  roleName: string;
}

interface TableUserRowProps {
  user: UserRow;
}

export function TableUserRow({ user }: TableUserRowProps) {
  return (
    <tr
      key={user.id}
      className='hover:bg-muted/30 transition-colors border-b border-border/50'
    >
      <td className='px-4 py-3 font-mono font-medium text-slate-500'>
        #{user.id.toString().padStart(3, "0")}
      </td>
      <td className='px-4 py-3'>
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-black dark:bg-white dark:text-black-300 border border-indigo-200 dark:border-indigo-800 uppercase'>
          {user.username}
        </span>
      </td>
      <td className='px-4 py-3 text-slate-600 dark:text-slate-400 text-sm'>
        {user.email}
      </td>
      <td className='px-4 py-3 text-slate-600 dark:text-slate-400 text-sm italic'>
        {user.roleName}
      </td>
      <td className='px-4 py-3 text-right'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0 hover:bg-muted'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <UserActions userId={user.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
