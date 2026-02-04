// src/app/habitaciones/page.tsx
import { getBedrooms } from "@/app/actions/bedrooms/getBedrooms";
import TableBedrooms from "@/app/cards/bedroomsCards/table-bedrooms";
import prisma from "@/lib/db"; // Asegúrate de que la ruta a tu instancia de Prisma sea correcta

export default async function HabitacionesPage() {
  // Realizamos ambas consultas en el servidor
  const [bedrooms, seasons] = await Promise.all([
    getBedrooms(),
    prisma.seasons.findMany(),
  ]);

  return <TableBedrooms bedrooms={bedrooms} seasons={seasons} />;
}
