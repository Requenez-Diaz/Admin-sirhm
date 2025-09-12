import { getReservations } from "@/app/actions/reservation";
import { Bell } from "lucide-react";

export default async function NotificationsPage() {
    const reservations = await getReservations();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Bell className="h-6 w-6 text-blue-600" />
                Notificaciones
            </h1>

            {reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Bell className="h-12 w-12 mb-3 text-gray-400" />
                    <p className="text-lg">No tienes notificaciones nuevas 🎉</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {reservations.map((res) => (
                        <li
                            key={res.id}
                            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <Bell className="h-5 w-5" />
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm">
                                        📌 <span className="font-semibold">{res.name} {res.lastName}</span> realizó una nueva reservación.
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
