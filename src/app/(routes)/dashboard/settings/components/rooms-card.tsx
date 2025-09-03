"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Percent, Calendar, Eye } from "lucide-react";
import Link from "next/link";

interface PromotionRoomCardProps {
  promotion: {
    id: number;
    codePromotions: string;
    porcentageDescuent: number;
    dateStart: string;
    dateEnd: string;
    description?: string;
    BedroomsPromotions: Array<{
      bedroom: {
        id: number;
        name: string;
        type: string;
        number: string;
        typeBedroom: string;
      };
    }>;
  };
}

export function PromotionRoomCard({ promotion }: PromotionRoomCardProps) {
  const bedroom = promotion.BedroomsPromotions[0]?.bedroom;

  if (!bedroom) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Verificar si está activa
  const now = new Date();
  const isActive =
    now >= new Date(promotion.dateStart) && now <= new Date(promotion.dateEnd);

  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-lg'>{promotion.codePromotions}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Activa" : "Inactiva"}
          </Badge>
        </div>
        <CardDescription>Promoción para habitación específica</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Información de la habitación */}
        <div className='flex items-center gap-2'>
          <MapPin className='h-4 w-4 text-blue-600' />
          <div className='flex items-center gap-2'>
            <span className='font-medium'>
              {bedroom.name} - {bedroom.type} #{bedroom.number}
            </span>
            <Badge variant='outline' className='text-xs'>
              ID: {bedroom.id}
            </Badge>
          </div>
        </div>

        {/* Descuento */}
        <div className='flex items-center gap-2'>
          <Percent className='h-4 w-4 text-green-600' />
          <span className='text-lg font-semibold text-green-600'>
            {promotion.porcentageDescuent}% de descuento
          </span>
        </div>

        {/* Fechas */}
        <div className='flex items-center gap-2 text-muted-foreground'>
          <Calendar className='h-4 w-4' />
          <span className='text-sm'>
            {formatDate(promotion.dateStart)} - {formatDate(promotion.dateEnd)}
          </span>
        </div>

        {/* Descripción */}
        {promotion.description && (
          <p className='text-sm text-muted-foreground line-clamp-2'>
            {promotion.description}
          </p>
        )}

        {/* Botón para ver detalles */}
        <Link href={`/dashboard/offerts/${promotion.id}`}>
          <Button variant='outline' className='w-full bg-transparent'>
            <Eye className='h-4 w-4 mr-2' />
            Ver habitación específica
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
