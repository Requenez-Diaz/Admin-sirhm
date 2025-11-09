"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import ReservationDetailModal from "./ReservationDetailModal";
import NotificationMenu from "./NotificationMenu";
import { getAllUserNotifications } from "@/app/actions/notification/getNotification";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await getAllUserNotifications();
        if (!response.success) {
          setItems([]);
          return;
        }

        const combined = response.notifications.map((n) => ({
          id: n.id,
          user: n.user,
          message: n.message,
          reservation: n.reservation,
          createdAt: n.createdAt,
        }));

        combined.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setItems(combined);
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchAll();
  }, []);

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
              <div
                onClick={() =>
                  item.reservation &&
                  setSelectedReservation({
                    ...item.reservation,
                    user: item.user,
                  })
                }
                className="cursor-pointer p-4 border rounded-lg bg-white hover:shadow-md transition-shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.user?.image ? (
                    <div className="relative w-10 aspect-square rounded-full overflow-hidden border border-gray-300">
                      <Image
                        src={item.user.image}
                        alt={item.user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 aspect-square rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      {item.user?.username?.[0]?.toUpperCase() ?? "U"}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-900">
                        {item.user?.username ?? "Usuario"}
                      </span>{" "}
                      ha reservado una{" "}
                      <span className="text-blue-600 font-medium">
                        {item.reservation?.bedroomsType || "habitación"}
                      </span>.
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <NotificationMenu
                  notificationId={item.id}
                  onDeleted={() =>
                    setItems((prev) => prev.filter((i) => i.id !== item.id))
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          selectedReservation={selectedReservation}
          setSelectedReservation={setSelectedReservation}
        />
      )}
    </div>
  );
}
