import { CalendarCheck2 } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { AddReservation } from "@/app/(routes)/dashboard/bookings/addReservation";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export const statusVariants: Record<BookingStatus, BadgeProps["variant"]> = {
  PENDING: "info",
  CONFIRMED: "success",
  CANCELLED: "destructive",
};

export const statusLabels: Record<BookingStatus, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
};

interface StatusCounters {
  PENDING: number;
  CONFIRMED: number;
  CANCELLED: number;
}

interface TableReservationHeaderProps {
  counters: StatusCounters;
}

export function TableReservationHeader({
  counters,
}: TableReservationHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariants.PENDING}>
          {statusLabels.PENDING}: {counters.PENDING}
        </Badge>
        <Badge variant={statusVariants.CONFIRMED}>
          {statusLabels.CONFIRMED}: {counters.CONFIRMED}
        </Badge>
        <Badge variant={statusVariants.CANCELLED}>
          {statusLabels.CANCELLED}: {counters.CANCELLED}
        </Badge>
      </div>

      <div className="flex-shrink-0">
        <AddReservation />
      </div>
    </div>
  );
}

export function TableReservationTitle() {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
        <CalendarCheck2 className="h-6 w-6 text-black dark:text-white" />
        <h1 className="text-2xl font-black tracking-tight uppercase">
          Control de Reservaciones
        </h1>
      </div>
      <p className="text-slate-500 text-sm italic">
        Gestión centralizada de reservas, estados de pago y disponibilidad de
        clientes.
      </p>
    </div>
  );
}
