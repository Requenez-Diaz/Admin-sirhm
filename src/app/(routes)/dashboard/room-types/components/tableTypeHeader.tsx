import { Layers } from "lucide-react";
import TypeBedroomForm from "@/app/cards/typeBedrooms/components/AddTypeBedroomsForm";

export function TableTypeHeader() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <Layers className="h-6 w-6 text-black dark:text-white" />
        <h1 className="text-2xl font-black tracking-tight uppercase">
          Tipos de Habitaciones
        </h1>
      </div>
      <p className="text-slate-500 text-sm italic">
        Define las categorías base para el inventario de dormitorios.
      </p>
    </div>
  );
}

export function TableTypeActions() {
  return (
    <div className="flex justify-start bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
      <TypeBedroomForm />
    </div>
  );
}
