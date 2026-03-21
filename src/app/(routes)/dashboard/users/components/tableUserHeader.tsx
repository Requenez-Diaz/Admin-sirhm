import { Users } from "lucide-react";

export function TableUserHeader() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <Users className="h-6 w-6 text-black dark:text-white" />
        <h1 className="text-2xl font-black tracking-tight uppercase">
          Gestión de Usuarios
        </h1>
      </div>
      <p className="text-slate-500 text-sm italic">
        Administra los usuarios del sistema y sus permisos.
      </p>
    </div>
  );
}
