import { getHistoricReservations } from "@/app/actions/reservation/getHistoricReservations";
import HistoricReservationsTable, { Reservation } from "./HistoricReservationsTable";

export default async function HistoricReservationsPage() {
    const historic: Reservation[] = await getHistoricReservations();

    return (
        <div className="w-full p-6">
            <h1 className="text-2xl font-semibold mb-6">Historial de Reservaciones</h1>
            <HistoricReservationsTable data={historic} />
        </div>
    );
}
