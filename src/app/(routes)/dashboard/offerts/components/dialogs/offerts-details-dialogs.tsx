"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Promotion } from "../../type";
import {
  formatDate,
  getBedroomTypes,
  getSeasonName,
} from "../utils/promotions-utils";
import { OfferStatusBadge } from "../../tables/offert-status-badge";

interface OfferDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Promotion | null;
}

export function OfferDetailsDialog({
  open,
  onOpenChange,
  offer,
}: OfferDetailsDialogProps) {
  return offer ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Detalles de la Oferta</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Código
              </h4>
              <p className='text-base'>{offer.codePromotions}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Descuento
              </h4>
              <p className='text-base'>{offer.porcentageDescuent}%</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Temporada
              </h4>
              <p className='text-base'>{getSeasonName(offer)}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Estado
              </h4>
              <p className='text-base'>
                <OfferStatusBadge offer={offer} />
              </p>
            </div>
          </div>

          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Periodo de validez
            </h4>
            <p className='text-base'>
              {formatDate(offer.dateStart)} - {formatDate(offer.dateEnd)}
            </p>
          </div>

          <div>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Tipos de habitación
            </h4>
            <div className='flex flex-wrap gap-2 mt-1'>
              {getBedroomTypes(offer).map((type: string, index: number) => (
                <Badge key={index} variant='secondary'>
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {offer.description && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>
                Descripción
              </h4>
              <p className='text-base'>{offer.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}
