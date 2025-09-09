import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

interface TestimonialStatsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function TestimonialStats({
  total,
  pending,
  approved,
  rejected,
}: TestimonialStatsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <Card className='border-l-4 border-l-primary'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Testimoniales
          </CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{total}</div>
          <p className='text-xs text-muted-foreground'>
            Total de testimoniales recibidos
          </p>
        </CardContent>
      </Card>

      <Card className='border-l-4 border-l-yellow-500'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Pendientes</CardTitle>
          <Clock className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-yellow-600'>{pending}</div>
          <p className='text-xs text-muted-foreground'>Esperando moderación</p>
        </CardContent>
      </Card>

      <Card className='border-l-4 border-l-green-500'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Aprobados</CardTitle>
          <CheckCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-green-600'>{approved}</div>
          <p className='text-xs text-muted-foreground'>
            Publicados en el sitio
          </p>
        </CardContent>
      </Card>

      <Card className='border-l-4 border-l-red-500'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Rechazados</CardTitle>
          <XCircle className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold text-red-600'>{rejected}</div>
          <p className='text-xs text-muted-foreground'>
            No aptos para publicación
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
