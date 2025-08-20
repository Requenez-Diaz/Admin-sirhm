import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Percent, Tag, Clock } from "lucide-react";
import Link from "next/link";
import { getPromotion } from "@/app/actions/promotions/promotions-actions";

interface PromotionPageProps {
  params: {
    id: string;
  };
}

export default async function PromotionPage({ params }: PromotionPageProps) {
  const promotionId = Number.parseInt(params.id);
  const result = await getPromotion(promotionId);

  if (!result.success || !result.data) {
    notFound();
  }

  const promotion = result.data;
  const bedroom = promotion.BedroomsPromotions[0]?.bedroom; // Solo una habitación

  if (!bedroom) {
    notFound();
  }

  // Calcular precios (asumiendo que tienes esta lógica)
  const originalPrice = bedroom.highSeasonPrice || 0; // Ajusta según tu lógica de temporadas
  const discount = (originalPrice * promotion.porcentageDescuent) / 100;
  const finalPrice = originalPrice - discount;

  // Verificar si la promoción está activa
  const now = new Date();
  const startDate = new Date(promotion.dateStart);
  const endDate = new Date(promotion.dateEnd);
  const isActive = now >= startDate && now <= endDate;

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className='container mx-auto py-8 space-y-6'>
      {/* Header con botón de regreso */}
      <div className='flex items-center gap-4'>
        <Link href='/dashboard/offerts'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Volver a ofertas
          </Button>
        </Link>
        <div>
          <h1 className='text-3xl font-bold'>Detalle de Oferta</h1>
          <p className='text-muted-foreground'>
            Habitación específica con promoción aplicada
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Información de la promoción */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <Tag className='h-5 w-5' />
                {promotion.codePromotions}
              </CardTitle>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Activa" : "Inactiva"}
              </Badge>
            </div>
            <CardDescription>Información de la promoción</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Percent className='h-4 w-4 text-green-600' />
              <span className='text-2xl font-bold text-green-600'>
                {promotion.porcentageDescuent}% de descuento
              </span>
            </div>

            <div className='flex items-center gap-2 text-muted-foreground'>
              <Calendar className='h-4 w-4' />
              <span>
                Del {formatDate(promotion.dateStart)} al{" "}
                {formatDate(promotion.dateEnd)}
              </span>
            </div>

            <div className='flex items-center gap-2 text-muted-foreground'>
              <Clock className='h-4 w-4' />
              <span>
                Temporada: {promotion.seasons?.nameSeason || "No especificada"}
              </span>
            </div>

            {promotion.description && (
              <div className='p-3 bg-muted rounded-lg'>
                <p className='text-sm'>{promotion.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de la habitación específica */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MapPin className='h-5 w-5' />
              Habitación Específica
            </CardTitle>
            <CardDescription>
              Detalles de la habitación con promoción
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <div className='flex items-center gap-2 mb-2'>
                <h3 className='font-semibold text-blue-800'>
                  {bedroom.typeBedroom} - {bedroom.description} #
                  {bedroom.numberBedroom}
                </h3>
                <Badge variant='outline' className='text-xs'>
                  ID: {bedroom.id}
                </Badge>
              </div>
              <p className='text-sm text-blue-600'>{bedroom.typeBedroom}</p>
            </div>

            {/* Información de precios */}
            <div className='space-y-3'>
              <h4 className='font-medium'>Precios con promoción:</h4>
              <div className='grid grid-cols-1 gap-2'>
                <div className='flex justify-between items-center p-2 bg-muted rounded'>
                  <span className='text-sm'>Precio original:</span>
                  <span className='font-medium'>${originalPrice}</span>
                </div>
                <div className='flex justify-between items-center p-2 bg-red-50 rounded'>
                  <span className='text-sm text-red-600'>Descuento:</span>
                  <span className='font-medium text-red-600'>
                    -${discount.toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between items-center p-2 bg-green-50 rounded border border-green-200'>
                  <span className='text-sm font-medium text-green-700'>
                    Precio final:
                  </span>
                  <span className='text-xl font-bold text-green-700'>
                    ${finalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información Adicional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-muted rounded-lg'>
              <div className='text-2xl font-bold text-primary'>
                {promotion.porcentageDescuent}%
              </div>
              <div className='text-sm text-muted-foreground'>
                Descuento aplicado
              </div>
            </div>
            <div className='text-center p-4 bg-muted rounded-lg'>
              <div className='text-2xl font-bold text-primary'>
                ${discount.toFixed(2)}
              </div>
              <div className='text-sm text-muted-foreground'>Ahorro total</div>
            </div>
            <div className='text-center p-4 bg-muted rounded-lg'>
              <div className='text-2xl font-bold text-primary'>1</div>
              <div className='text-sm text-muted-foreground'>
                Habitación específica
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta si la promoción no está activa */}
      {!isActive && (
        <Card className='border-orange-200 bg-orange-50'>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2 text-orange-800'>
              <Clock className='h-4 w-4' />
              <span className='font-medium'>
                Esta promoción no está actualmente activa.
                {now < startDate &&
                  ` Comenzará el ${formatDate(promotion.dateStart)}.`}
                {now > endDate &&
                  ` Finalizó el ${formatDate(promotion.dateEnd)}.`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
