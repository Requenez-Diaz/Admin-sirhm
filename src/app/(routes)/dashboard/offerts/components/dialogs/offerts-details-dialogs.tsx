"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
      <DialogContent className='sm:max-w-[450px] p-0 overflow-hidden rounded-xl'>
        <div className="bg-slate-50/50 dark:bg-slate-900/50 p-6 border-b border-border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <DialogTitle className="text-xl font-bold mb-1">
                Oferta <span className="text-primary">{offer.codePromotions}</span>
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Detalles completos de la promoción
              </p>
            </div>
            <OfferStatusBadge offer={offer} />
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold text-2xl flex items-baseline gap-1">
              -{offer.porcentageDescuent}<span className="text-sm font-medium">%</span>
            </div>
          </div>
        </div>

        <div className='p-6 space-y-6'>
          <div className='grid grid-cols-2 gap-y-6 gap-x-4'>
            <div className="space-y-1.5">
              <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Temporada
              </h4>
              <p className='text-sm font-medium'>{getSeasonName(offer)}</p>
            </div>

            <div className="space-y-1.5">
              <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Periodo de validez
              </h4>
              <p className='text-sm font-medium'>
                {formatDate(offer.dateStart)} - {formatDate(offer.dateEnd)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
              Habitaciones Aplicables
            </h4>
            <div className='flex flex-wrap gap-2'>
              {getBedroomTypes(offer).map((type: string, index: number) => (
                <Badge key={index} variant='secondary' className="bg-secondary/50 hover:bg-secondary/70 border-none px-3 py-1 font-normal">
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {offer.description && (
            <div className="space-y-2 pt-4 border-t border-border">
              <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Descripción Adicional
              </h4>
              <p className='text-sm leading-relaxed text-slate-600 dark:text-slate-300'>
                {offer.description}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}
