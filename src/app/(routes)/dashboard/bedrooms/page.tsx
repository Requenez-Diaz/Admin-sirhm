import { getBedrooms } from "@/app/actions/bedrooms/getBedrooms";
import TableBedrooms from "@/app/cards/bedroomsCards/table-bedrooms";

export default async function HabitacionesPage() {
  const bedrooms = await getBedrooms();

  return <TableBedrooms bedrooms={bedrooms} />;
}