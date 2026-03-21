import { ShieldCheck } from "lucide-react";
import { AddRoles } from "@/app/cards/roleCards/add-role";

export function TableRoleHeader() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <ShieldCheck className="h-6 w-6 text-black dark:text-white" />
        <h1 className="text-2xl font-black tracking-tight uppercase">
          Gestión de Roles
        </h1>
      </div>
      <p className="text-slate-500 text-sm italic">
        Configura los niveles de acceso y permisos para los usuarios del
        sistema.
      </p>
    </div>
  );
}

export function TableRoleActions() {
  return (
    <div className="flex justify-start bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <AddRoles />
    </div>
  );
}
