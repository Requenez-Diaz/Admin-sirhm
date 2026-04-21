import findManyUsers from "@/app/actions/users/get-users";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { UserCog } from "lucide-react";
import React from "react";
import {
  TableUserHeader,
  TableUserRow,
  TableUserFooter,
  TableUserEmptyState,
} from "./components";

export default async function Page() {
  const users = await findManyUsers();

  return (
    <div className='p-6 space-y-6'>
      <TableUserHeader />

      <div className='rounded-xl border border-border overflow-x-auto relative bg-background shadow-sm'>
        <Table className='min-w-full'>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px] font-bold text-foreground whitespace-nowrap'>
                <div className='flex items-center gap-2'>
                  <UserCog className='h-4 w-4 text-slate-400' /> ID
                </div>
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider whitespace-nowrap'>
                Usuario
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider whitespace-nowrap'>
                Email
              </TableHead>
              <TableHead className='font-bold text-foreground uppercase text-xs tracking-wider whitespace-nowrap'>
                Rol
              </TableHead>

              <TableHead className='sticky right-0 z-20 bg-muted/95 backdrop-blur-sm text-right font-bold text-foreground uppercase text-xs tracking-wider shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]'>
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((user) => <TableUserRow key={user.id} user={user} />)
            ) : (
              <TableUserEmptyState />
            )}
          </TableBody>
        </Table>
      </div>

      <TableUserFooter totalCount={users?.length || 0} />
    </div>
  );
}
