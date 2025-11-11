import { getPromotions } from "@/app/actions/promotions/promotions-actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PromotionRoomCard } from "./components/rooms-card";

interface Bedroom {
  id: number;
  name: string;
  type: string;
  number: string;
  typeBedroom: string;
}

interface Promotion {
  id: number;
  codePromotions: string;
  porcentageDescuent: number;
  dateStart: string;
  dateEnd: string;
  description?: string;
  BedroomsPromotions: { bedroom: Bedroom }[];
}

export default async function OffertsPage() {
  const result = await getPromotions();

  // Asegurarnos de que data no sea undefined antes de mapear
  const promotions: Promotion[] = (result.data ?? []).map((promo: any) => ({
    id: promo.id,
    codePromotions: promo.codePromotions,
    porcentageDescuent: promo.porcentageDescuent,
    dateStart: new Date(promo.dateStart).toISOString(),
    dateEnd: new Date(promo.dateEnd).toISOString(),
    description: promo.description,
    BedroomsPromotions: (promo.BedroomsPromotions ?? []).map((bp: any) => ({
      bedroom: {
        id: bp.bedroom.id,
        name: bp.bedroom.name ?? "",
        type: bp.bedroom.type ?? "",
        number: bp.bedroom.number ?? "",
        typeBedroom: bp.bedroom.typeBedroom ?? "",
      },
    })),
  }));

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ofertas por Habitación</h1>
          <p className="text-muted-foreground">
            Gestiona promociones específicas por habitación
          </p>
        </div>
        <Link href="/dashboard/offerts/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Oferta
          </Button>
        </Link>
      </div>

      {promotions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No hay ofertas creadas aún
          </p>
          <Link href="/dashboard/offerts">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Crear primera oferta
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <PromotionRoomCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      )}
    </div>
  );
}
