import { UsersRound, Hotel, Calendar, BedDouble } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { getReservations } from "@/app/actions/reservation";
import { getBedrooms } from "@/app/actions/bedrooms";
import { findManyUsers } from "@/app/actions/users";
import RoomTypeTable from "./dashboard-charts/RoomTypeTable";
import ReportDashboard from "./dashboard-charts/ReportDashboard";
import SyncSeasonsOnClient from "../SyncSeasonsOnClient";

export default async function DashboardPage() {
  const reservations = await getReservations();
  const bedrooms = await getBedrooms();
  const users = await findManyUsers();

  const confirmed = reservations.filter(r => r.status === "CONFIRMED").length;
  const pending = reservations.filter(r => r.status === "PENDING").length;
  const canceled = reservations.filter(r => r.status === "CANCELLED").length;

  const totalGuests = reservations.reduce((acc, r) => acc + r.guests, 0);

  const occupiedRooms = reservations
    .filter(r => r.status === "CONFIRMED")
    .reduce((acc, r) => acc + r.rooms, 0);

  return (
    <div>
      <SyncSeasonsOnClient />
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Usuarios"
          value={users.length}
          description="+0% desde el último mes"
          icon={<UsersRound className="h-6 w-6" />}
          href="/dashboard/users"
          type="users"
        />

        <DashboardCard
          title="Habitaciones"
          value={bedrooms.length}
          icon={<Hotel className="h-6 w-6" />}
          href="/dashboard/bedrooms"
          type="rooms"
          extraContent={
            <div className="text-xs mt-1">
              Total de huéspedes: {totalGuests}
            </div>
          }
        />

        <DashboardCard
          title="Habitaciones Ocupadas"
          value={occupiedRooms}
          description="Habitaciones actualmente reservadas"
          icon={<BedDouble className="h-6 w-6" />}
          type="occupied"
        />

        <DashboardCard
          title="Reservaciones"
          value={reservations.length}
          icon={<Calendar className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-xs" />}
          href="/dashboard/bookings"
          type="reservations"
          extraContent={
            <div className="flex flex-wrap gap-2 mt-1 text-xs">
              <span>Confirmadas: {confirmed}</span>
              <span>Pendientes: {pending}</span>
              <span>Canceladas: {canceled}</span>
            </div>
          }
        />
      </div>

      <ReportDashboard />
      <RoomTypeTable reservations={reservations} />
    </div>
  );
}
