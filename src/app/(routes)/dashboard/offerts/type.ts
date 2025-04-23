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
  editingOffer?: Promotion;
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

export interface BedroomPromotion {
  id?: number;
  promotionId?: number;
  bedroomId?: number;
  bedroom: Bedroom;
  // Make all fields optional except bedroom to handle both structures
}

export interface Promotion {
  id: number;
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: string | Date;
  dateEnd: string | Date;
  description?: string;
  seasonId?: number;
  createdAt: string | Date;

  // Support both naming conventions
  season?: Season;
  seasons?: Season;

  // Support both naming conventions
  bedroomPromotions?: BedroomPromotion[];
  BedroomsPromotions?: BedroomPromotion[];
}

export interface FormValues {
  codePromotions: string;
  porcentageDescuent: number;
  dateRange: {
    from: Date;
    to: Date;
  };
  seasonId: string;
  bedroomIds: string[];
  description: string;
}

export interface PromotionResponse {
  success: boolean;
  data?: Promotion[];
  error?: string;
}

export interface DeletePromotionResponse {
  success: boolean;
  error?: string;
  message?: string;
}
