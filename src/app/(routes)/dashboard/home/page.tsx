import { UsersRound, Hotel, Calendar, ShoppingCart } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { getReservations } from "@/app/actions/reservation";
import { getServices } from "@/app/actions/services";
import { getBedrooms } from "@/app/actions/bedrooms";
import { findManyUsers } from "@/app/actions/users";
import RoomTypeTable from "../reports/RoomTypeTable";
import ReportDashboard from "../reports/ReportDashboard";

export default async function DashboardPage() {
  const reservations = await getReservations();
  const services = await getServices();
  const bedrooms = await getBedrooms();
  const users = await findManyUsers();

  // Contar reservaciones por estado
  const confirmed = reservations.filter(r => r.status === "CONFIRMED").length;
  const pending = reservations.filter(r => r.status === "PENDING").length;
  const canceled = reservations.filter(r => r.status === "CANCELLED").length;

  return (
    <div>
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
          description="+0% desde el último mes"
          icon={<Hotel className="h-6 w-6" />}
          href="/dashboard/bedrooms"
          type="rooms"
        />

        <DashboardCard
          title="Reservaciones"
          value={reservations.length}
          // description="+0% desde el último mes"
          icon={<Calendar className="h-6 w-6" />}
          href="/dashboard/bookings"
          type="reservations"
          extraContent={
            <div className="flex gap-4 mt-1 text-xs">
              <span>Confirmadas: {confirmed}</span>
              <span>Pendientes: {pending}</span>
              <span>Canceladas: {canceled}</span>
            </div>
          }
        />

        <DashboardCard
          title="Servicios"
          value={services.length}
          description="+0% desde el último mes"
          icon={<ShoppingCart className="h-6 w-6" />}
          href="/dashboard/services"
          type="services"
        />
      </div>

      <ReportDashboard />
      <RoomTypeTable reservations={reservations} />
    </div>
  );
}
