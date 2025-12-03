import { getReservations, ReservationFormatted } from "@/app/actions/reservation/getReservation";
import TableReservation from "../data-table/tableReservation";
import { Status } from "@prisma/client";

export default async function ReservationPage() {
  // Obtenemos las reservas desde el servidor
  const reservations: ReservationFormatted[] = await getReservations();

  // Mapeamos los datos al formato que TableReservation espera
  const formattedReservations = reservations.map((res) => ({
    id: res.id,
    name: res.userName,
    lastName: "", // si no tienes apellido en tu base, déjalo vacío
    email: res.userEmail,
    status: res.status as Status, // convierte a Status si tu status es string
    guests: res.totalGuests,
    rooms: res.totalRooms,
    bedroomsType: res.bedroomsType,
    arrivalDate: res.arrivalDate,
    departureDate: res.departureDate,
    offerts: res.offerts,
  }));

  return <TableReservation reservations={formattedReservations} />;
}
