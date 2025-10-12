"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getReservations } from "@/app/actions/reservation/getReservation";
import ReservationDetailModal from "./ReservationDetailModal";
import { getNotifications } from "./getNotifications";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reservations, notifications] = await Promise.all([
          getReservations(),
          getNotifications(),
        ]);

        const combined = [
          ...reservations.map((r) => ({ ...r, kind: "reservation" })),
          ...notifications.map((n) => ({ ...n, kind: "notification" })),
        ];

        combined.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setItems(combined);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando notificaciones...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Bell className="h-7 w-7 text-blue-600" />
        Notificaciones
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <Bell className="h-12 w-12 mb-3 text-gray-400" />
          <p className="text-lg">No tienes notificaciones 🎉</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              {item.kind === "reservation" ? (
                <ReservationDetailModal
                  reservation={item}
                  selectedReservation={selectedReservation}
                  setSelectedReservation={setSelectedReservation}
                />
              ) : (
                <div className="p-4 border rounded-lg bg-blue-50 shadow-sm flex items-center gap-3">
                  {item.user?.image ? (
                    <img
                      src={item.user.image}
                      alt={item.user.username}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold">
                      {item.user?.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-blue-700">{item.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
