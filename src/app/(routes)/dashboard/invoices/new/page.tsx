"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BedDouble, UserSearch, ReceiptText, Loader2 } from "lucide-react";
import { getLastReservationByClient } from "@/app/actions/invoices/reservationsForInvoices";
import { createInvoice } from "@/app/actions/invoices/createInvoices";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function NewInvoicePage() {
  const router = useRouter();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingRes, setLoadingRes] = useState(false);

  const PRECIO_HABITACION_NIO = 800;

  const fetchLastReservation = async () => {
    if (!clientId) return;
    setLoadingRes(true);

    const res = await getLastReservationByClient(clientId);

    if (res.success && res.data) {
      const detail = res.data.ReservationDetails[0];
      const noches =
        Math.ceil(
          (new Date(detail.dateEnd).getTime() -
            new Date(detail.dateStart).getTime()) /
            (1000 * 60 * 60 * 24),
        ) || 1;

      const tipoHab = detail.Bedrooms.TypeBedrooms?.nameType || "Estándar";

      setItems([
        {
          item: `ESTANCIA: HAB #${detail.Bedrooms.numberBedroom} (${tipoHab})`,
          price: PRECIO_HABITACION_NIO,
          amount: noches,
          type: tipoHab,
        },
      ]);
      toast.success("Reserva confirmada encontrada");
    } else {
      toast.error(res.error || "No se encontró reservación");
      setItems([]);
    }
    setLoadingRes(false);
  };

  const handleFinalSave = async () => {
    if (items.length === 0 || !clientId) return;
    setIsSaving(true);
    const result = await createInvoice({ clientId: parseInt(clientId), items });
    if (result.success) {
      router.push(`/dashboard/invoices/${result.id}`);
    } else {
      toast.error("Error al guardar");
      setIsSaving(false);
    }
  };

  return (
    <div className='p-4 md:p-10 max-w-3xl mx-auto space-y-6'>
      <div className='flex items-center gap-3 mb-2'>
        <ReceiptText className='h-8 w-8 text-primary' />
        <h1 className='text-3xl font-black uppercase tracking-tight'>
          Caja de Facturación
        </h1>
      </div>

      <Card className='border-border bg-card text-card-foreground'>
        <CardHeader>
          <CardTitle className='text-sm font-bold uppercase flex items-center gap-2'>
            <UserSearch className='h-4 w-4' /> Buscar Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className='flex gap-3'>
          <Input
            type='number'
            placeholder='ID del cliente (ej. 15)'
            className='bg-background border-input'
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <Button onClick={fetchLastReservation} disabled={loadingRes}>
            {loadingRes ? (
              <Loader2 className='animate-spin h-4 w-4' />
            ) : (
              "Cargar Reserva"
            )}
          </Button>
        </CardContent>
      </Card>
      {items.length > 0 && (
        <Card className='border-primary/20 bg-primary/5 shadow-2xl animate-in fade-in zoom-in-95 duration-300'>
          <CardContent className='p-8 space-y-6'>
            <div className='flex justify-between items-start'>
              <div className='space-y-1'>
                <Badge
                  variant='outline'
                  className='text-primary border-primary'
                >
                  Reserva Confirmada
                </Badge>
                <h2 className='text-xl font-bold'>{items[0].item}</h2>
                <div className='flex items-center gap-2 text-muted-foreground text-sm'>
                  <BedDouble className='h-4 w-4' />
                  <span>Tipo: {items[0].type}</span>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-xs font-bold uppercase text-muted-foreground'>
                  Total a Pagar
                </p>
                <p className='text-3xl font-black text-primary'>
                  C$ {(items[0].price * items[0].amount).toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className='bg-primary/20' />

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='p-4 rounded-lg bg-background/50 border'>
                <p className='text-muted-foreground'>Precio por Noche</p>
                <p className='font-bold'>
                  C$ {items[0].price.toLocaleString()}
                </p>
              </div>
              <div className='p-4 rounded-lg bg-background/50 border'>
                <p className='text-muted-foreground'>Cant. Noches</p>
                <p className='font-bold'>{items[0].amount}</p>
              </div>
            </div>

            <Button
              className='w-full h-14 text-lg font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-transform'
              onClick={handleFinalSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className='animate-spin mr-2' />
              ) : (
                "Generar Factura"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
