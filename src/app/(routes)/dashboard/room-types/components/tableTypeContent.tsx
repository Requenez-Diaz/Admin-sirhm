import { Layers } from "lucide-react";
import TypeBedroomForm from "@/app/cards/typeBedrooms/components/AddTypeBedroomsForm";
import { TableTypeRow } from "./tableTypeRow";

interface TypeBedroom {
  id: number;
  nameType: string;
  description: string;
  _count?: {
    Bedrooms: number;
  };
}

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

export default function TypeBedroomsTable({ data }: { data: TypeBedroom[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-background shadow-sm">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted/50">
          <tr className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
            <th className="px-6 py-4 text-left">ID</th>
            <th className="px-6 py-4 text-left">Nombre del Tipo</th>
            <th className="px-6 py-4 text-left">Descripción</th>
            <th className="px-6 py-4 text-center">Cant. Habitaciones</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((type) => (
            <TableTypeRow key={type.id} type={type} />
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="p-16 text-center text-muted-foreground italic bg-muted/5">
          No existen categorías registradas en el sistema.
        </div>
      )}
    </div>
  );
}
