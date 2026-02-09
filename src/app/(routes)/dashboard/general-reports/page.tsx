import { getReservationReport } from "@/app/actions/reports/reports";
import ReportButtons from "./reports-button";

import { Card, CardContent } from "@/components/ui/card";
import {Users, Hotel } from "lucide-react";
import ReportFilters from "./reports-filter";

export default async function ReportPage(props: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { start, end } = searchParams;

  const result = await getReservationReport(start, end);
  if (!result.success || !result.data)
    return <div className='p-10'>Error al cargar datos.</div>;

  return (
    <div className='p-8 max-w-7xl mx-auto space-y-6'>
      <div className='flex justify-between items-end'>
        <div>
          <h1 className='text-3xl font-black'>Reportes Financieros</h1>
          <p className='text-muted-foreground mt-1'>
            Creado por:{" "}
            <span className='font-bold text-foreground'>Administración</span> |
            Periodo:{" "}
            <span className='font-bold text-foreground'>
              {start || "Inicio"} - {end || "Hoy"}
            </span>
          </p>
        </div>
        <ReportButtons
          data={result.data}
          metrics={result.metrics}
          startDate={start}
          endDate={end}
        />
      </div>

      {/* PANEL DE PREVISUALIZACIÓN RÁPIDA (DASHBOARD) */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='bg-slate-900 text-white'>
          <CardContent className='pt-6'>
            <p className='text-xs text-slate-400 uppercase font-bold tracking-widest'>
              Ingreso Total
            </p>
            <h2 className='text-3xl font-black mt-2 text-green-400'>
              ${result.metrics.ingresosTotales.toLocaleString()}
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6 flex justify-between items-center'>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-bold'>
                Ocupación
              </p>
              <h2 className='text-3xl font-black mt-2 text-blue-600'>
                {result.metrics.tasaOcupacion}%
              </h2>
            </div>
            <Hotel className='w-8 h-8 text-blue-200' />
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6 flex justify-between items-center'>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-bold'>
                Clientes Activos
              </p>
              <h2 className='text-3xl font-black mt-2 text-purple-600'>
                {result.data.length}
              </h2>
            </div>
            <Users className='w-8 h-8 text-purple-200' />
          </CardContent>
        </Card>
      </div>

      <ReportFilters />

      <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr className='text-[10px] font-bold uppercase text-gray-400'>
              <th className='px-6 py-4 text-left'>Cliente</th>
              <th className='px-6 py-4 text-left'>Ingresos</th>
              <th className='px-6 py-4 text-center'>Habitaciones</th>
              <th className='px-6 py-4 text-center'>Reservas</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-100'>
            {result.data.map((row: any) => (
              <tr
                key={row.Email}
                className='hover:bg-gray-50 transition text-sm'
              >
                <td className='px-6 py-4'>
                  <div className='font-bold text-gray-900'>{row.Cliente}</div>
                  <div className='text-xs text-gray-500 font-mono'>
                    {row.Email}
                  </div>
                </td>
                <td className='px-6 py-4 font-mono font-bold text-green-700'>
                  ${row.Total_Gastado.toLocaleString()}
                </td>
                <td className='px-6 py-4 text-center'>
                  <span className='px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100'>
                    {row.Hab_Ocupadas}
                  </span>
                </td>
                <td className='px-6 py-4 text-center font-semibold'>
                  {row.Frecuencia}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
