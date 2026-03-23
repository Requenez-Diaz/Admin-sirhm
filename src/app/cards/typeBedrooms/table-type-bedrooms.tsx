import { Layers } from "lucide-react";
import TypeBedroomForm from "./components/AddTypeBedroomsForm";
import { DeleteTypeButton } from "./components/DeleteTypeBedrooms";

interface TypeBedroom {
  id: number;
  nameType: string;
  description: string;
  _count?: {
    Bedrooms: number;
  };
}

export default async function TypeBedroomsTable({
  data,
}: {
  data: TypeBedroom[];
}) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted/20">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Layers className="w-4 h-4" /> Categorías de Habitaciones
        </h3>
      </div>

      <div className="overflow-x-auto">
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
              <tr
                key={type.id}
                className="hover:bg-muted/30 transition-colors text-sm group"
              >
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  #{type.id}
                </td>
                <td className="px-6 py-4 font-bold text-foreground group-hover:text-primary transition-colors">
                  {type.nameType}
                </td>
                <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                  {type.description}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black border border-primary/20">
                    {type._count?.Bedrooms || 0} HABs
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <TypeBedroomForm
                      initialData={{
                        id: type.id,
                        nameType: type.nameType,
                        description: type.description,
                      }}
                    />
                    <DeleteTypeButton id={type.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="p-16 text-center text-muted-foreground italic bg-muted/5">
          No existen categorías registradas en el sistema.
        </div>
      )}
    </div>
  );
}
