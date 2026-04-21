import { getReservations } from "@/app/actions/reservation/getReservation";
import TableReservation from "../data-table/tableReservation";

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const reservations = await getReservations();

  return <TableReservation reservations={reservations} />;
}