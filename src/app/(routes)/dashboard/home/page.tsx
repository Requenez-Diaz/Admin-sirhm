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
  const user = await findManyUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Usuarios"
          value={user.length}
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
          description="+0% desde el último mes"
          icon={<Calendar className="h-6 w-6" />}
          href="/dashboard/bookings"
          type="reservations"
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
