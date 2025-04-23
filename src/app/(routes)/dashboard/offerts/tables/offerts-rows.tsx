import { TableCell, TableRow } from "@/components/ui/table";
import { Promotion } from "../type";
import {
  formatDate,
  getSeasonName,
  renderBedroomTypes,
} from "../components/utils/promotions-utils";
import { OfferStatusBadge } from "./offert-status-badge";
import { OfferActionsMenu } from "./offert-status-actions";

interface OfferRowProps {
  offer: Promotion;
  onView: (offer: Promotion) => void;
  onEdit: (offer: Promotion) => void;
  onDelete: (offer: Promotion) => void;
}

export function OfferRow({ offer, onView, onEdit, onDelete }: OfferRowProps) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{offer.codePromotions}</TableCell>
      <TableCell>{offer.porcentageDescuent}%</TableCell>
      <TableCell>{getSeasonName(offer)}</TableCell>
      <TableCell>
        <div className='flex flex-col'>
          <span>{formatDate(offer.dateStart)}</span>
          <span>{formatDate(offer.dateEnd)}</span>
        </div>
      </TableCell>
      <TableCell>{renderBedroomTypes(offer)}</TableCell>
      <TableCell>
        <OfferStatusBadge offer={offer} />
      </TableCell>
      <TableCell className='text-right'>
        <OfferActionsMenu
          offer={offer}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
}
