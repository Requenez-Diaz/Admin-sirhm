"use client";

import React, { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  ArrowLeft,
  Receipt,
  User,
  CalendarDays,
  QrCode,
  CreditCard,
  // History eliminado de aquí porque no se usaba
} from "lucide-react";
import Link from "next/link";
import { getFullInvoiceDetail } from "@/app/actions/invoices/getInvoicesId";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFullInvoiceDetail(id).then((res) => {
      if (res.success) setData(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading)
    return (
      <div className='flex h-screen items-center justify-center bg-background'>
        <div className='flex flex-col items-center gap-2'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
          <p className='text-sm font-medium animate-pulse'>
            Generando Factura...
          </p>
        </div>
      </div>
    );

  if (!data)
    return <div className='p-10 text-center'>No se encontró la factura.</div>;

  return (
    <div className='p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between print:hidden sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4'>
        <Button
          variant='outline'
          asChild
          className='hover:bg-accent transition-all'
        >
          <Link href='/dashboard/invoices'>
            <ArrowLeft className='mr-2 h-4 w-4' /> Volver
          </Link>
        </Button>
        <Button onClick={() => window.print()} className='font-bold shadow-lg'>
          <Printer className='mr-2 h-4 w-4' /> Imprimir C$
        </Button>
      </div>

      <Card className='border-border shadow-2xl overflow-hidden bg-card text-card-foreground print:shadow-none print:border-none'>
        <CardContent className='p-0'>
          <div className='invoice-container p-8 md:p-12 print:p-0'>
            <div className='flex flex-col md:flex-row justify-between items-start gap-6 mb-10'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-primary'>
                  <div className='bg-primary/10 p-2 rounded-lg'>
                    <Receipt className='h-8 w-8' />
                  </div>
                  <h1 className='text-4xl font-black uppercase tracking-tighter'>
                    Factura{" "}
                    <span className='text-muted-foreground/40'>NIO</span>
                  </h1>
                </div>
                <Badge
                  variant='secondary'
                  className='font-mono text-xs px-3 py-1 border border-border'
                >
                  ID: #INV-{data.id.toString().padStart(6, "0")}
                </Badge>
              </div>
              <div className='text-right'>
                <h2 className='text-2xl font-black text-primary'>
                  Hotelito Madroño
                </h2>
                <p className='text-sm font-medium opacity-80'>
                  Servicios de Alojamiento
                </p>
                <p className='text-xs text-muted-foreground'>RAAS, Nicaragua</p>
              </div>
            </div>

            <Separator className='my-8 opacity-50' />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-10'>
              <div className='p-5 rounded-xl bg-muted/30 border border-border/50 space-y-3'>
                <h3 className='text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2'>
                  <User className='h-3 w-3' /> Cliente
                </h3>
                <div className='space-y-1'>
                  <p className='font-bold text-lg leading-none'>
                    {data.client?.username || "Consumidor Final"}
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {data.client?.email}
                  </p>
                </div>
                <Badge variant='outline' className='bg-background/50'>
                  CÓDIGO: {data.clientId}
                </Badge>
              </div>

              <div className='p-5 rounded-xl bg-primary/5 border border-primary/10 space-y-3 md:text-right'>
                <h3 className='text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 md:justify-end'>
                  Detalles <CalendarDays className='h-3 w-3' />
                </h3>
                <p className='text-sm font-medium'>
                  Emisión:{" "}
                  {new Date(data.date).toLocaleDateString("es-NI", {
                    dateStyle: "long",
                  })}
                </p>
                {data.reservation?.ReservationDetails?.[0] && (
                  <div className='flex justify-start md:justify-end'>
                    <Badge className='bg-primary text-primary-foreground font-bold uppercase text-[10px]'>
                      Habitación #
                      {
                        data.reservation.ReservationDetails[0].Bedrooms
                          .numberBedroom
                      }
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className='rounded-xl border border-border overflow-hidden mb-8'>
              <table className='w-full text-sm'>
                <thead className='bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest'>
                  <tr>
                    <th className='p-4 text-left font-black'>Descripción</th>
                    <th className='p-4 text-center font-black'>Cant.</th>
                    <th className='p-4 text-right font-black'>Precio</th>
                    <th className='p-4 text-right font-black'>Total</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-border/50'>
                  {data.invoceDetail.map((item: any) => (
                    <tr
                      key={item.id}
                      className='hover:bg-muted/20 transition-colors'
                    >
                      <td className='p-4 font-bold text-foreground'>
                        {item.item}
                      </td>
                      <td className='p-4 text-center font-medium'>
                        {item.amount}
                      </td>
                      <td className='p-4 text-right text-muted-foreground font-mono'>
                        C$ {item.price.toLocaleString()}
                      </td>
                      <td className='p-4 text-right font-black text-primary dark:text-blue-400'>
                        C$ {(item.price * item.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-center gap-8 pt-6'>
              <div className='flex items-center gap-4 p-4 bg-muted/50 rounded-2xl border-2 border-dashed border-border print:border-black'>
                <div className='bg-white p-2 rounded-xl'>
                  <QrCode className='h-12 w-12 text-black' />
                </div>
                <div className='text-left'>
                  <p className='text-[10px] font-black uppercase tracking-tighter'>
                    QR de Control
                  </p>
                  <p className='text-[8px] text-muted-foreground leading-tight italic'>
                    SIRHM Nicaragua
                  </p>
                </div>
              </div>

              <div className='w-full md:w-80 p-6 rounded-2xl bg-secondary text-secondary-foreground shadow-lg border border-border relative overflow-hidden'>
                <div className='absolute top-0 right-0 p-4 opacity-5'>
                  <CreditCard className='h-16 w-16' />
                </div>
                <div className='space-y-2 relative z-10'>
                  <div className='flex justify-between text-xs font-bold uppercase opacity-60'>
                    <span>Subtotal Neto:</span>
                    <span>C$ {data.total.toLocaleString()}</span>
                  </div>
                  <Separator className='bg-foreground/10 my-2' />
                  <div className='flex flex-col items-end gap-1'>
                    <span className='text-[10px] font-black uppercase tracking-widest opacity-50'>
                      Total Pagado
                    </span>
                    <span className='text-4xl font-black tracking-tighter text-foreground'>
                      C$ {data.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-12 text-center text-[10px] text-muted-foreground italic uppercase tracking-[0.2em]'>
              *** GRACIAS POR SU VISITA - HOTELITO MADROÑO ***
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER DE PÁGINA (History eliminado de aquí) */}
      <div className='flex justify-center gap-4 text-muted-foreground text-[10px] font-medium print:hidden'>
        <span className='flex items-center gap-1'>Registrado en Servidor</span>
        <span>•</span>
        <span>Generado por Módulo facturación SIRHM</span>
      </div>

      {/* ESLint Fix: Usar bloques de comentarios para ignorar las propiedades de styled-jsx */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          /* Show only the invoice card */
          .invoice-container,
          .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: fixed;
            left: 0;
            top: 0;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 12mm 16mm !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
            font-size: 11pt !important;
          }
          /* Force black text for readability */
          .invoice-container h1,
          .invoice-container h2,
          .invoice-container h3,
          .invoice-container p,
          .invoice-container span,
          .invoice-container td,
          .invoice-container th {
            color: black !important;
          }
          /* Hide nav chrome */
          header,
          aside,
          nav,
          footer,
          button,
          .print\\:hidden {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
