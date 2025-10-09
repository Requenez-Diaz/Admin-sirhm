"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getReservations, markAllAsRead } from "@/app/actions/reservation/getReservation";
import ReservationDetailModal from "./ReservationDetailModal";

export default function NotificationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  useEffect(() => {
    const fetchAndMark = async () => {
      try {
        const allReservations = await getReservations();
        setReservations(allReservations);
        await markAllAsRead();
      } catch (error) {
        console.error("Error cargando reservaciones", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndMark();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Cargando notificaciones...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Bell className="h-7 w-7 text-blue-600" />
        Notificaciones
      </h1>

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <Bell className="h-12 w-12 mb-3 text-gray-400" />
          <p className="text-lg">No tienes notificaciones nuevas 🎉</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li key={res.id}>
              <ReservationDetailModal
                reservation={res}
                selectedReservation={selectedReservation}
                setSelectedReservation={setSelectedReservation}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
