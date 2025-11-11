import { Bedrooms } from "@prisma/client";
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
  season?: Season;
  seasons?: Season;
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

export type BedroomsWithImages = Bedrooms & {
  galleryImages: {
    id: number;
    bedroomId: number;
    imageContent: string | null;
    mimeType: string;
    fileName: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

