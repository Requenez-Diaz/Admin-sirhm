// Importa el nuevo form

import { getTypeBedrooms } from "@/app/actions/roomsType/rooms-type";
import AddTypeBedroomForm from "@/app/cards/typeBedrooms/components/AddTypeBedroomsForm";
import TypeBedroomsTable from "@/app/cards/typeBedrooms/table-type-bedrooms";

export default async function TypeBedroomsPage() {
  const result = await getTypeBedrooms();

  return (
    <div className='p-8 space-y-6 max-w-7xl mx-auto'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-black uppercase border-l-4 border-primary pl-4 tracking-tighter'>
            Tipos de Habitaciones
          </h1>
          <p className='text-muted-foreground text-sm mt-1'>
            Define las categorías base para el inventario de dormitorios.
          </p>
        </div>

        {/* Aquí está el formulario modal */}
        <AddTypeBedroomForm />
      </div>

      <TypeBedroomsTable data={result.data || []} />
    </div>
  );
}
