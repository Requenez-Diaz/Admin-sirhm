import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Cargando datos...</CardTitle>
        <CardDescription>
          Espera mientras cargamos la información necesaria.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex justify-center items-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      </CardContent>
    </Card>
  );
}
