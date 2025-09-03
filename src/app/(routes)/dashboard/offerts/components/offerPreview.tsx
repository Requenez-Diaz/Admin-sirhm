import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Tag } from "lucide-react";
import type { UseFormWatch } from "react-hook-form";
import type { FormValues } from "../form-schema";
import type { Bedroom } from "../type";

type OfferPreviewProps = {
  watch: UseFormWatch<FormValues>;
  bedrooms: Bedroom[];
};

export function OfferPreview({ watch, bedrooms }: OfferPreviewProps) {
  const bedroomId = watch("bedroomId"); // Cambio: ahora es un string único
  const porcentageDescuent = watch("porcentageDescuent");
  const seasonId = watch("seasonId");
  const dateRange = watch("dateRange");
  const codePromotions = watch("codePromotions");

  // Si no hay habitación seleccionada o faltan datos esenciales, no mostrar nada
  if (!bedroomId || !porcentageDescuent || !seasonId) {
    return null;
  }

  // Encontrar la habitación seleccionada
  const bedroom = bedrooms.find((b) => b.id.toString() === bedroomId);
  if (!bedroom) {
    return null;
  }

  // Calcular precios
  const isLowSeason = seasonId === "1";
  const originalPrice = isLowSeason
    ? bedroom.lowSeasonPrice
    : bedroom.highSeasonPrice;
  const discount = (originalPrice * porcentageDescuent) / 100;
  const finalPrice = originalPrice - discount;

  // Formatear fechas
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className='bg-muted/50'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base flex items-center gap-2'>
          <Tag className='h-4 w-4' />
          Vista previa de la oferta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Información de la habitación */}
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <MapPin className='h-4 w-4 text-blue-600' />
              <span className='font-medium'>Habitación Específica:</span>
            </div>
            <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
              <div className='flex items-center gap-2'>
                <span className='font-medium'>
                  {bedroom.typeBedroom} - {bedroom.typeBedroom} #{bedroom.id}
                </span>
                <Badge variant='outline' className='text-xs'>
                  ID: {bedroom.id}
                </Badge>
              </div>
              <p className='text-sm text-blue-600 mt-1'>
                ßß
                {bedroom.typeBedroom}
              </p>
            </div>
          </div>

          {/* Información de precios */}
          <div className='grid grid-cols-1 gap-2 mt-4'>
            <div className='grid grid-cols-3 gap-2 font-medium text-sm'>
              <div>Precio Original</div>
              <div>Descuento</div>
              <div>Precio Final</div>
            </div>
            <div className='grid grid-cols-3 gap-2 text-sm border-t pt-2'>
              <div>${originalPrice}</div>
              <div className='text-red-500'>
                -${discount.toFixed(2)} ({porcentageDescuent}%)
              </div>
              <div className='font-medium text-green-600'>
                ${finalPrice.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Código de promoción */}
          {codePromotions && (
            <div className='mt-4'>
              <Badge variant='secondary' className='text-lg px-3 py-1'>
                {codePromotions}
              </Badge>
            </div>
          )}

          {/* Fechas */}
          {dateRange?.from && dateRange?.to && (
            <div className='flex items-center gap-2 text-muted-foreground mt-2'>
              <CalendarDays className='h-4 w-4' />
              <span>
                Válida del {formatDate(dateRange.from)} al{" "}
                {formatDate(dateRange.to)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
