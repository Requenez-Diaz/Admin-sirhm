// Tipos para los datos
export type Bedroom = {
  id: number;
  typeBedroom: string;
  lowSeasonPrice: number;
  highSeasonPrice: number;
};

export type Season = {
  id: number;
  nameSeason: string;
  dateStart: Date;
  dateEnd: Date;
};

export type OfferFormProps = {
  onSuccess?: () => void;
  editingOffer?: Promotion; // Replace 'any' with the Promotion type
};

export type PromotionData = {
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: Date;
  dateEnd: Date;
  description?: string;
  seasonId: number;
  bedroomIds: number[];
};

export interface Promotion {
  id: number;
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: string | Date;
  dateEnd: string | Date;
  description?: string;
  createdAt: string | Date;
  season?: Season;
  bedroomPromotions?: BedroomPromotion[];
  // Add other promotion properties as needed
}

export interface BedroomPromotion {
  id: number;
  bedroom: Bedroom;
  // Add other properties as needed
}
