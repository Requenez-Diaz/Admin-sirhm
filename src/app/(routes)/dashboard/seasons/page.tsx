import { getSeasons } from "@/app/actions/seasons/getSeasons";
import TableSeasons from "@/app/cards/seasonsCards/table-seasons";

export default async function SeasonsPage() {
  const seasons = await getSeasons();

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>
          Gestión de Temporadas
        </h1>
        <p className='text-muted-foreground'>
          Administra las fechas de temporada alta y baja para el cálculo de
          precios.
        </p>
      </div>

      <TableSeasons seasons={seasons} />
    </div>
  );
}
