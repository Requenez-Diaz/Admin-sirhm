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
import Image from "next/image";

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
                      className="p-4 border rounded-xl bg-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-4"
                      onClick={() => setSelectedReservation(res)}
                    >
                      {res.userImage ? (
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
                          <Image
                            src={res.userImage}
                            alt="Usuario"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Bell className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-sm text-gray-800 leading-snug">
                          <span className="font-semibold">{res.userName}</span> reservó{" "}
                          <span className="font-medium text-blue-600">{res.bedroomsType}</span> por{" "}
                          <span className="font-semibold">
                            {nights} {nights === 1 ? "noche" : "noches"}
                          </span>.
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

                  <DialogContent className="sm:max-w-xl rounded-2xl p-8 shadow-2xl bg-white border border-gray-100">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                        <Bell className="h-6 w-6 text-blue-600" />
                        Detalle de Reservación
                      </DialogTitle>
                      <DialogDescription className="mt-1 text-gray-500 text-sm">
                        Información completa de la reservación seleccionada.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-5">
                      {res.userImage ? (
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                          <Image
                            src={res.userImage}
                            alt="Usuario"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Bell className="h-8 w-8" />
                        </div>
                      )}
                      <div className="text-center sm:text-left">
                        <p className="font-semibold text-gray-800 text-lg">{res.userName}</p>
                        <p className="text-sm text-gray-500">{res.email}</p>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Habitación", value: res.bedroomsType },
                        { label: "Estado", value: res.status },
                        { label: "Noches", value: nights },
                        { label: "Habitaciones", value: res.rooms },
                        { label: "Huéspedes", value: res.guests },
                        { label: "Llegada", value: new Date(res.arrivalDate).toLocaleDateString() },
                        { label: "Salida", value: new Date(res.departureDate).toLocaleDateString() },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl shadow-inner transition-colors duration-150"
                        >
                          <p className="text-gray-600 text-sm">{item.label}</p>
                          <p className="font-semibold text-gray-800">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                      <DialogClose asChild>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                          Cerrar
                        </Button>
                      </DialogClose>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5"
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
