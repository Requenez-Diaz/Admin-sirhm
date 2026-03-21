import findManyUsers from "@/app/actions/users/get-users";
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
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
    <div className="p-6 space-y-6">
      <TableUserHeader />

      <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[100px] font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-slate-400" /> ID
                </div>
              </TableHead>
              <TableHead className="font-bold text-foreground uppercase text-xs tracking-wider">
                Usuario
              </TableHead>
              <TableHead className="font-bold text-foreground uppercase text-xs tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-bold text-foreground uppercase text-xs tracking-wider">
                Rol
              </TableHead>
              <TableHead className="text-right font-bold text-foreground uppercase text-xs tracking-wider">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => <TableUserRow key={user.id} user={user} />)
            ) : (
              <TableUserEmptyState />
            )}
          </tbody>
        </Table>
      </div>

      <TableUserFooter totalCount={users?.length || 0} />
    </div>
  );
}
