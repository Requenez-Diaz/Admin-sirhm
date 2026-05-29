"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  BedDouble,
  UserSearch,
  ReceiptText,
  Loader2,
  User,
} from "lucide-react";
import { createInvoice } from "@/app/actions/invoices/createInvoices";
import { getLastReservationByClient } from "@/app/actions/invoices/reservationsForInvoices";

export default function NewInvoicePage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto" />
        </div>
      }
    >
      <InvoiceForm />
    </Suspense>
  );
}

function InvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reservationId, setReservationId] = useState("");
  const [currentReservationId, setCurrentReservationId] = useState<
    number | null
  >(null);
  const [clientName, setClientName] = useState("");
  const [clientId, setClientId] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingRes, setLoadingRes] = useState(false);

  // Auto-load from URL params and fetch immediately
  useEffect(() => {
    const defaultReservationId = searchParams.get("reservationId");
    if (defaultReservationId) {
      setReservationId(defaultReservationId);
      // Fetch immediately to ensure it loads on first render without relying on the second effect
      if (items.length === 0 && !loadingRes) {
        fetchLastReservation(defaultReservationId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Solo reaccionar cuando el usuario escriba manualmente en el input
    // Evitamos re-disparar si ya estamos cargando o ya hay items
    if (
      reservationId &&
      !searchParams.get("reservationId") &&
      items.length === 0 &&
      !loadingRes
    ) {
      // Opcional: Podrías querer que busque automáticamente al terminar de escribir un ID,
      // pero normalmente eso se hace con el botón. Dejaremos este efecto por compatibilidad
      // por si el usuario esperaba que al escribir buscara (aunque lo ideal es usar el botón).
    }
  }, [reservationId]);

  const fetchLastReservation = async (overrideReservationId?: string) => {
    const idToSearch = overrideReservationId || reservationId;
    if (!idToSearch && !clientName) {
      toast.error("Ingresa un ID o un Nombre para buscar");
      return;
    }

    setLoadingRes(true);

    const res = await getLastReservationByClient(idToSearch, clientName);

    if (res.success && res.data) {
      const activeDetails = res.data.ReservationDetails.filter(
        (detail: any) => detail.status !== "CANCELLED",
      );

      const allItems = activeDetails.map((detail: any) => {
        const noches =
          Math.ceil(
            (new Date(detail.dateEnd).getTime() -
              new Date(detail.dateStart).getTime()) /
              (1000 * 60 * 60 * 24),
          ) || 1;

        const tipoHab = detail.Bedrooms.TypeBedrooms?.nameType || "Estándar";

        // El campo 'price' ya es el subtotal (Precio * Noches) según nuestra estandarización
        const subtotalReserva = detail.price || 0;
        const precioPorNoche =
          noches > 0 ? subtotalReserva / noches : subtotalReserva;

        return {
          item: `ESTANCIA: HAB #${detail.Bedrooms.numberBedroom} (${tipoHab})`,
          price: precioPorNoche,
          amount: noches,
          type: tipoHab,
        };
      });

      setReservationId(res.data.id.toString());
      setCurrentReservationId(res.data.id);
      setClientId(res.data.user_id);
      setItems(allItems);
      toast.success(
        `Reserva encontrada: ${res.data.User?.username || "Cliente"}`,
      );
    } else {
      toast.error(res.error || "No se encontró reservación");
      setItems([]);
    }
    setLoadingRes(false);
  };

  const handleFinalSave = async () => {
    if (items.length === 0 || !clientId) return;
    setIsSaving(true);
    const result = await createInvoice({
      clientId,
      items,
      reservationId: currentReservationId || undefined,
    });
    if (result.success) {
      router.push(`/dashboard/invoices/${result.id}`);
    } else {
      toast.error("Error al guardar");
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <ReceiptText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Caja de Facturación
        </h1>
      </div>

      <Card className="border-border bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase flex items-center gap-2">
            <UserSearch className="h-4 w-4" /> Buscar Reservación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INPUT ID */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase opacity-60 pl-1">
                Por ID Reservación
              </label>
              <Input
                type="number"
                placeholder="Ej: 4"
                className="bg-background border-input"
                value={reservationId}
                onChange={(e) => {
                  setReservationId(e.target.value);
                  if (e.target.value) setClientName("");
                }}
              />
            </div>

            {/* INPUT NOMBRE */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase opacity-60 pl-1">
                Por Nombre
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ej: Avimilex Requenez"
                  className="bg-background border-input pl-9"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (e.target.value) {
                      setReservationId("");
                      setClientId(null);
                    }
                  }}
                />
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button
            onClick={() => fetchLastReservation()}
            disabled={loadingRes}
            variant={"fetch" as any}
            className="w-full font-bold uppercase"
          >
            {loadingRes ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              "Buscar Reservación"
            )}
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Card className="border-primary/20 bg-primary/5 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
          <CardContent className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Reserva Confirmada
                </Badge>
                {items.length === 1 ? (
                  <>
                    <h2 className="text-xl font-bold">{items[0].item}</h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <BedDouble className="h-4 w-4" />
                      <span>Tipo: {items[0].type}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold uppercase">
                      Varias Habitaciones ({items.length})
                    </h2>
                    <div className="flex flex-col gap-1">
                      {items.map((it: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-muted-foreground text-xs"
                        >
                          <BedDouble className="h-3 w-3" />
                          <span>{it.item}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                  Total a Pagar
                </p>
                <p className="text-3xl font-black text-primary">
                  C${" "}
                  {items
                    .reduce((acc, i) => acc + i.price * i.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className="bg-primary/20 h-[1px]" />

            {items.length === 1 && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-background/50 border">
                  <p className="text-muted-foreground">Precio por Noche</p>
                  <p className="font-bold text-foreground">
                    C$ {items[0].price.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border">
                  <p className="text-muted-foreground">Cant. Noches</p>
                  <p className="font-bold text-foreground">{items[0].amount}</p>
                </div>
              </div>
            )}

            <Button
              className="w-full py-6 text-lg font-bold uppercase tracking-widest"
              variant={"save" as any}
              onClick={handleFinalSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                "Generar Factura Final"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
