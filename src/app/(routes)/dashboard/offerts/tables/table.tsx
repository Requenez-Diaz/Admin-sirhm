"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import {
  getPromotions,
  deletePromotion,
} from "@/app/actions/promotions/promotions-actions";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import type { Promotion } from "../type";

// Add this debugging function
// const debugData = (data: any) => {
//   console.log("DEBUG DATA STRUCTURE:");
//   console.log(JSON.stringify(data, null, 2));

//   // Check for BedroomsPromotions
//   if (data && data.BedroomsPromotions) {
//     console.log("BedroomsPromotions exists:", data.BedroomsPromotions);
//   } else if (data && data.bedroomPromotions) {
//     console.log("bedroomPromotions exists:", data.bedroomPromotions);
//   } else {
//     console.log("Neither BedroomsPromotions nor bedroomPromotions exists");
//   }

//   // Check for seasons
//   if (data && data.seasons) {
//     console.log("seasons exists:", data.seasons);
//   } else if (data && data.season) {
//     console.log("season exists:", data.season);
//   } else {
//     console.log("Neither seasons nor season exists");
//   }
// };

interface OffersTableProps {
  onEdit?: (offer: Promotion) => void;
}

export function OffersTable({ onEdit }: OffersTableProps) {
  const [offers, setOffers] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Promotion | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Cargar las ofertas al montar el componente
  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        // Llamar directamente al server action
        const result = await getPromotions();
        console.log("Ofertas obtenidas:", result);
        if (result.success && result.data && result.data.length > 0) {
          // Debug the first promotion to see its structure

          setOffers(result.data || []);
        } else {
          toast({
            title: "Error",
            description: result.error || "No se pudieron cargar las ofertas",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error al cargar ofertas:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las ofertas.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, []);

  const isOfferActive = (offer: Promotion) => {
    const now = new Date();
    const startDate = new Date(offer.dateStart);
    const endDate = new Date(offer.dateEnd);

    // Asegurar que las fechas se comparan correctamente
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Si la fecha actual está entre la fecha de inicio y fin, o si es una oferta recién creada
    return (
      (now >= startDate && now <= endDate) ||
      new Date(offer.createdAt).getTime() > now.getTime() - 86400000
    ); // Considerar activa si se creó en las últimas 24 horas
  };

  const handleDelete = async (id: number) => {
    try {
      // Llamar directamente al server action para eliminar
      const result = await deletePromotion(id);
      if (result.success) {
        setOffers(offers.filter((offer) => offer.id !== id));
        setShowDeleteDialog(false);
        toast({
          title: "Oferta eliminada",
          description: "La oferta ha sido eliminada correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo eliminar la oferta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al eliminar oferta:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la oferta.",
        variant: "destructive",
      });
    }
  };

  const confirmDelete = (offer: Promotion) => {
    setSelectedOffer(offer);
    setShowDeleteDialog(true);
  };

  const viewDetails = (offer: Promotion) => {
    setSelectedOffer(offer);
    setShowDetailsDialog(true);
  };

  const handleEdit = (offer: Promotion) => {
    if (onEdit) {
      onEdit(offer);
    }
  };

  // Modify the getBedroomTypes function to handle both naming conventions
  const getBedroomTypes = (offer: Promotion): string[] => {
    console.log(
      "Datos de habitaciones para oferta:",
      offer.id,
      offer.BedroomsPromotions || offer.bedroomPromotions
    );

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

  // Modificar la función renderBedroomTypes para mostrar mejor la información
  const renderBedroomTypes = (offer: Promotion): string => {
    const types = getBedroomTypes(offer);
    console.log("Tipos de habitación encontrados:", types);

    if (types.length === 0) {
      return "Ninguna";
    }

    if (types.length <= 2) {
      return types.join(", ");
    }

    return `${types.length} habitaciones`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ofertas</CardTitle>
          <CardDescription>
            Listado de ofertas para habitaciones según temporada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className='flex justify-center items-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead>Validez</TableHead>
                  <TableHead>Habitaciones</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className='text-center py-6 text-muted-foreground'
                    >
                      No hay ofertas disponibles. Crea una nueva oferta para
                      comenzar.
                    </TableCell>
                  </TableRow>
                ) : (
                  offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className='font-medium'>
                        {offer.codePromotions}
                      </TableCell>
                      <TableCell>{offer.porcentageDescuent}%</TableCell>
                      <TableCell>
                        {offer.seasons
                          ? offer.seasons.nameSeason
                          : offer.season
                            ? offer.season.nameSeason
                            : "Desconocida"}
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-col'>
                          <span>
                            {format(new Date(offer.dateStart), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </span>
                          <span>
                            {format(new Date(offer.dateEnd), "dd MMM yyyy", {
                              locale: es,
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{renderBedroomTypes(offer)}</TableCell>
                      <TableCell>
                        {isOfferActive(offer) ? (
                          <Badge variant='default' className='bg-green-500'>
                            <CheckCircle className='h-3 w-3 mr-1' /> Activa
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-muted-foreground'
                          >
                            <XCircle className='h-3 w-3 mr-1' /> Inactiva
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <span className='sr-only'>Abrir menú</span>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                stroke='currentColor'
                                strokeWidth='2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                className='h-4 w-4'
                              >
                                <circle cx='12' cy='12' r='1' />
                                <circle cx='12' cy='5' r='1' />
                                <circle cx='12' cy='19' r='1' />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => viewDetails(offer)}
                            >
                              <Eye className='h-4 w-4 mr-2' /> Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(offer)}>
                              <Edit className='h-4 w-4 mr-2' /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-destructive focus:text-destructive'
                              onClick={() => confirmDelete(offer)}
                            >
                              <Trash2 className='h-4 w-4 mr-2' /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la oferta &ldquo;
              {selectedOffer?.codePromotions}&rdquo;? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              variant='destructive'
              onClick={() => selectedOffer && handleDelete(selectedOffer.id)}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Offer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>Detalles de la Oferta</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Código
                  </h4>
                  <p className='text-base'>{selectedOffer.codePromotions}</p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Descuento
                  </h4>
                  <p className='text-base'>
                    {selectedOffer.porcentageDescuent}%
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Temporada
                  </h4>
                  <p className='text-base'>
                    {selectedOffer.seasons?.nameSeason ||
                      selectedOffer.season?.nameSeason ||
                      "Desconocida"}
                  </p>
                </div>
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Estado
                  </h4>
                  <p className='text-base'>
                    {isOfferActive(selectedOffer) ? (
                      <Badge variant='default' className='bg-green-500'>
                        <CheckCircle className='h-3 w-3 mr-1' /> Activa
                      </Badge>
                    ) : (
                      <Badge
                        variant='outline'
                        className='text-muted-foreground'
                      >
                        <XCircle className='h-3 w-3 mr-1' /> Inactiva
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Periodo de validez
                </h4>
                <p className='text-base'>
                  {format(new Date(selectedOffer.dateStart), "dd MMMM yyyy", {
                    locale: es,
                  })}{" "}
                  -{" "}
                  {format(new Date(selectedOffer.dateEnd), "dd MMMM yyyy", {
                    locale: es,
                  })}
                </p>
              </div>

              <div>
                <h4 className='text-sm font-medium text-muted-foreground'>
                  Tipos de habitación
                </h4>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {getBedroomTypes(selectedOffer).map(
                    (type: string, index: number) => (
                      <Badge key={index} variant='secondary'>
                        {type}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {selectedOffer.description && (
                <div>
                  <h4 className='text-sm font-medium text-muted-foreground'>
                    Descripción
                  </h4>
                  <p className='text-base'>{selectedOffer.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
