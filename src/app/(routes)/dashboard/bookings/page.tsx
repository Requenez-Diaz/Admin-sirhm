import { getReservations } from "@/app/actions/reservation/getReservation";
import TableReservation from "../data-table/tableReservation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function ReservationPage() {
  const reservations = await getReservations();

  return (
    <Suspense
      fallback={
        <div className='p-8 text-center'>Cargando panel de reservas...</div>
      }
    >
      <TableReservation reservations={reservations} />
    </Suspense>
  );
}
