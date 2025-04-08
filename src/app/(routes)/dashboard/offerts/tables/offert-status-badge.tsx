import { CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "../type";
import { isOfferActive } from "../components/utils/promotions-utils";

interface OfferStatusBadgeProps {
  offer: Promotion;
}

export function OfferStatusBadge({ offer }: OfferStatusBadgeProps) {
  return isOfferActive(offer) ? (
    <Badge variant='default' className='bg-green-500'>
      <CheckCircle className='h-3 w-3 mr-1' /> Activa
    </Badge>
  ) : (
    <Badge variant='outline' className='text-muted-foreground'>
      <XCircle className='h-3 w-3 mr-1' /> Inactiva
    </Badge>
  );
}
