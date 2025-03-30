import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UseFormWatch } from "react-hook-form";
import { FormValues } from "../form-schema";
import { Bedroom } from "../type";

type OfferPreviewProps = {
  watch: UseFormWatch<FormValues>;
  bedrooms: Bedroom[];
};

export function OfferPreview({ watch, bedrooms }: OfferPreviewProps) {
  const bedroomIds = watch("bedroomIds");
  const porcentageDescuent = watch("porcentageDescuent");
  const seasonId = watch("seasonId");

  if (bedroomIds.length === 0 || !porcentageDescuent || !seasonId) {
    return null;
  }

  return (
    <Card className='bg-muted/50'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-base'>Vista previa de la oferta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div className='grid grid-cols-4 gap-2 font-medium text-sm'>
            <div>Tipo de Habitación</div>
            <div>Precio Original</div>
            <div>Descuento</div>
            <div>Precio Final</div>
          </div>
          {bedroomIds.map((bedroomId) => {
            const bedroom = (bedrooms || []).find(
              (b) => b.id.toString() === bedroomId
            );
            if (!bedroom) {
              return null;
            }

            const isLowSeason = seasonId === "1";
            const originalPrice = isLowSeason
              ? bedroom.lowSeasonPrice
              : bedroom.highSeasonPrice;
            const discount = (originalPrice * porcentageDescuent) / 100;
            const finalPrice = originalPrice - discount;

            return (
              <div
                key={bedroomId}
                className='grid grid-cols-4 gap-2 text-sm border-t pt-2'
              >
                <div>{bedroom.typeBedroom}</div>
                <div>${originalPrice}</div>
                <div>-${discount.toFixed(2)}</div>
                <div className='font-medium'>${finalPrice.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
