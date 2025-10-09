"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getReservations, markAllAsRead } from "@/app/actions/reservation/getReservation";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  const router = useRouter();

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
          {reservations.map((res) => {
            const nights = calculateDuration(res.arrivalDate, res.departureDate);

            return (
              <li key={res.id}>
                <Dialog
                  open={selectedReservation?.id === res.id}
                  onOpenChange={(open) => !open && setSelectedReservation(null)}
                >
                  <DialogTrigger asChild>
                    <div
                      className="p-4 border rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer flex items-center gap-4"
                      onClick={() => setSelectedReservation(res)}
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-lg">
                        <Bell className="h-6 w-6" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">
                          📌 <span className="font-semibold">{res.name} {res.lastName}</span> reservó{" "}
                          <span className="font-medium text-blue-600">{res.bedroomsType}</span> por{" "}
                          <span className="font-semibold">{nights} {nights === 1 ? "noche" : "noches"}</span>.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(res.createdAt).toLocaleString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-xl rounded-2xl p-6 shadow-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                        <Bell className="h-6 w-6 text-blue-600" />
                        Detalle de Reservación
                      </DialogTitle>
                      <DialogDescription className="mt-1 text-gray-500 text-sm">
                        Información completa de la reservación seleccionada.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Nombre</p>
                        <p className="font-semibold text-gray-800">{res.name} {res.lastName}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Habitación</p>
                        <p className="font-semibold text-gray-800">{res.bedroomsType}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Estado</p>
                        <p className="font-semibold text-gray-800">{res.status}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Noches</p>
                        <p className="font-semibold text-gray-800">{nights}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Habitaciones</p>
                        <p className="font-semibold text-gray-800">{res.roomsCount || 1}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Huéspedes</p>
                        <p className="font-semibold text-gray-800">{res.guestsCount || 1}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Fecha de llegada</p>
                        <p className="font-semibold text-gray-800">{new Date(res.arrivalDate).toLocaleDateString()}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                        <p className="text-gray-600 text-sm">Fecha de salida</p>
                        <p className="font-semibold text-gray-800">{new Date(res.departureDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                      <DialogClose asChild>
                        <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">Cerrar</Button>
                      </DialogClose>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => router.push("/dashboard/bookings")}
                      >
                        Ir a Reservaciones
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
