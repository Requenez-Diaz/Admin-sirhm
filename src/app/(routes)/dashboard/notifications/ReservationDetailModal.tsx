"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { calculateDuration } from "@/app/actions/reservation/calculateDuration";

interface ReservationDetailModalProps {
    reservation: any;
    selectedReservation: any | null;
    setSelectedReservation: (res: any | null) => void;
}

export default function ReservationDetailModal({
    reservation,
    selectedReservation,
    setSelectedReservation,
}: ReservationDetailModalProps) {
    const router = useRouter();
    const nights = calculateDuration(
        reservation.arrivalDate,
        reservation.departureDate
    );

    return (
        <Dialog
            open={selectedReservation?.id === reservation.id}
            onOpenChange={(open) => !open && setSelectedReservation(null)}
        >
            <DialogTrigger asChild>
                <div
                    className="p-4 border rounded-xl bg-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-4"
                    onClick={() => setSelectedReservation(reservation)}
                >
                    {reservation.userImage ? (
                        <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
                            <Image
                                src={reservation.userImage}
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
                            <span className="font-semibold">{reservation.userName}</span> reservó{" "}
                            <span className="font-medium text-blue-600">{reservation.bedroomsType}</span> por{" "}
                            <span className="font-semibold">
                                {nights} {nights === 1 ? "noche" : "noches"}
                            </span>.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {new Date(reservation.createdAt).toLocaleString("es-ES", {
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
                    {reservation.userImage ? (
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm">
                            <Image
                                src={reservation.userImage}
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
                        <p className="font-semibold text-gray-800 text-lg">
                            {reservation.userName}
                        </p>
                        <p className="text-sm text-gray-500">{reservation.email}</p>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: "Habitación", value: reservation.bedroomsType },
                        { label: "Estado", value: reservation.status },
                        { label: "Noches", value: nights },
                        { label: "Habitaciones", value: reservation.rooms },
                        { label: "Huéspedes", value: reservation.guests },
                        {
                            label: "Llegada",
                            value: new Date(reservation.arrivalDate).toLocaleDateString(),
                        },
                        {
                            label: "Salida",
                            value: new Date(reservation.departureDate).toLocaleDateString(),
                        },
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
                        <Button
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
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
    );
}
