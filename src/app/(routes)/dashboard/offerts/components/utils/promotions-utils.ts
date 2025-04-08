import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Promotion } from "../../type";

// Check if an offer is active
export const isOfferActive = (offer: Promotion): boolean => {
  const now = new Date();
  const startDate = new Date(offer.dateStart);
  const endDate = new Date(offer.dateEnd);

  // Ensure dates are compared correctly
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // If current date is between start and end date, or if it's a recently created offer
  return (
    (now >= startDate && now <= endDate) ||
    new Date(offer.createdAt).getTime() > now.getTime() - 86400000 // Consider active if created in the last 24 hours
  );
};

// Get bedroom types from an offer
export const getBedroomTypes = (offer: Promotion): string[] => {
  // Try BedroomsPromotions first (from Prisma)
  if (
    offer.BedroomsPromotions &&
    Array.isArray(offer.BedroomsPromotions) &&
    offer.BedroomsPromotions.length > 0
  ) {
    return offer.BedroomsPromotions.filter(
      (bp) => bp && bp.bedroom && bp.bedroom.typeBedroom
    ).map((bp) => bp.bedroom.typeBedroom);
  }

  // Try bedroomPromotions as fallback (from your type)
  if (
    offer.bedroomPromotions &&
    Array.isArray(offer.bedroomPromotions) &&
    offer.bedroomPromotions.length > 0
  ) {
    return offer.bedroomPromotions
      .filter((bp) => bp && bp.bedroom && bp.bedroom.typeBedroom)
      .map((bp) => bp.bedroom.typeBedroom);
  }

  // If neither exists or they're empty, return an empty array
  return [];
};

// Format bedroom types for display
export const renderBedroomTypes = (offer: Promotion): string => {
  const types = getBedroomTypes(offer);

  if (types.length === 0) {
    return "Ninguna";
  }

  if (types.length <= 2) {
    return types.join(", ");
  }

  return `${types.length} habitaciones`;
};

// Get season name from an offer
export const getSeasonName = (offer: Promotion): string => {
  return offer.seasons
    ? offer.seasons.nameSeason
    : offer.season
      ? offer.season.nameSeason
      : "Desconocida";
};

// Format date for display
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd MMM yyyy", { locale: es });
};

// Extract bedroom IDs from an offer
export const getBedroomIdsFromOffer = (offer?: Promotion): number[] => {
  if (!offer) return [];

  // Try BedroomsPromotions first
  if (
    offer.BedroomsPromotions &&
    Array.isArray(offer.BedroomsPromotions) &&
    offer.BedroomsPromotions.length > 0
  ) {
    return offer.BedroomsPromotions.filter(
      (bp) => bp && (bp.bedroomId || (bp.bedroom && bp.bedroom.id))
    ).map((bp) => bp.bedroomId || bp.bedroom.id);
  }

  // Try bedroomPromotions as fallback
  if (
    offer.bedroomPromotions &&
    Array.isArray(offer.bedroomPromotions) &&
    offer.bedroomPromotions.length > 0
  ) {
    return offer.bedroomPromotions
      .filter((bp) => bp && (bp.bedroomId || (bp.bedroom && bp.bedroom.id)))
      .map((bp) => bp.bedroomId || bp.bedroom.id);
  }

  return [];
};
