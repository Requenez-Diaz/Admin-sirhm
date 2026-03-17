import { getBedrooms } from "@/app/actions/bedrooms/getBedrooms";
import { getTypeBedrooms } from "@/app/actions/bedrooms/getTypeBedrooms";
import TableBedrooms from "@/app/cards/bedroomsCards/table-bedrooms";
import prisma from "@/lib/db"; // Asegúrate de que la ruta a tu instancia de Prisma sea correcta

export default async function HabitacionesPage() {
  // Realizamos las consultas en el servidor
  const [bedrooms, seasons, roomTypes] = await Promise.all([
    getBedrooms(),
    prisma.season.findMany({
      orderBy: { dateStart: "asc" },
    }),
    getTypeBedrooms(),
  ]);

  return (
    <TableBedrooms
      bedrooms={bedrooms}
      seasons={seasons}
      roomTypes={roomTypes}
    />
  );
}
