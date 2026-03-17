import { getReservationReport } from "@/app/actions/reports/reports";
import ReportButtons from "./reports-button";
import ReportFilters from "./reports-filter";
import ReportTable from "./ReportTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Hotel,
  Calendar,
  User,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";

export default async function ReportPage(props: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { start, end } = searchParams;

  const result = await getReservationReport(start, end);

  if (!result.success || !result.data) {
    return (
      <div className='p-10 text-center text-destructive'>
        Error al cargar datos.
      </div>
    );
  }

  return (
    <div className='p-8 max-w-7xl mx-auto space-y-8 bg-background text-foreground transition-colors'>
      {/* HEADER */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-end gap-4'>
        <div className='space-y-1'>
          <h1 className='text-3xl font-black tracking-tight border-l-4 border-primary pl-4 uppercase'>
            Control de Reservaciones
          </h1>
          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            <span className='flex items-center gap-1'>
              <User className='w-3 h-3' /> Admin
            </span>
            <span>•</span>
            <span className='flex items-center gap-1'>
              <Calendar className='w-3 h-3' />
              {start ? new Date(start).toLocaleDateString() : "Inicio"} -{" "}
              {end ? new Date(end).toLocaleDateString() : "Hoy"}
            </span>
          </div>
        </div>
        <ReportButtons
          data={result.data}
          metrics={result.metrics}
          startDate={start}
          endDate={end}
        />
      </div>
      <ReportFilters />
      {/* DASHBOARD DE MÉTRICAS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='bg-primary text-primary-foreground border-none shadow-xl'>
          <CardContent className='pt-6'>
            <p className='text-xs uppercase font-bold opacity-80'>
              Ingreso Bruto Periodo
            </p>
            <div className='flex items-center justify-between'>
              <h2 className='text-4xl font-black mt-1'>
                C${result.metrics.ingresosTotales.toLocaleString()}
              </h2>
              <ArrowUpRight className='w-8 h-8 opacity-50' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card border-border'>
          <CardContent className='pt-6 flex justify-between items-center'>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-bold'>
                Reservas Realizadas
              </p>
              <h2 className='text-3xl font-black mt-1'>
                {result.metrics.totalReservas}
              </h2>
            </div>
            <div className='bg-muted p-3 rounded-full'>
              <ClipboardList className='w-6 h-6 text-muted-foreground' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-card border-border'>
          <CardContent className='pt-6 flex justify-between items-center'>
            <div>
              <p className='text-xs text-muted-foreground uppercase font-bold'>
                Ocupación Real
              </p>
              <h2 className='text-3xl font-black mt-1 text-blue-500'>
                {result.metrics.tasaOcupacion}%
              </h2>
            </div>
            <div className='bg-blue-500/10 p-3 rounded-full'>
              <Hotel className='w-6 h-6 text-blue-500' />
            </div>
          </CardContent>
        </Card>
      </div>
      <ReportTable data={result.data} metrics={result.metrics} />
    </div>
  );
}
