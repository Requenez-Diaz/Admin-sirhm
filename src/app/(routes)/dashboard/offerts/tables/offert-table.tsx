"use client";

import { useState, useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";

import {
  getPromotions,
  deletePromotion,
  updatePromotion,
} from "@/app/actions/promotions/promotions-actions";
import { FormValues, Promotion } from "../type";
import { OfferRow } from "./offerts-rows";
import { DeleteOfferDialog } from "../components/dialogs/delete-offerts-dialgs";
import { OfferDetailsDialog } from "../components/dialogs/offerts-details-dialogs";
import { EditOfferDialog } from "../components/dialogs/edit-offerts-dialogs";

export function OffersTable() {
  const [offers, setOffers] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<Promotion | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Load offers on component mount
  useEffect(() => {
    loadOffers();
  }, []);

  // Function to load offers
  async function loadOffers() {
    setLoading(true);
    try {
      const result = await getPromotions();
      if (result.success && result.data) {
        setOffers(result.data);
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

  // Handle view offer details
  const handleViewDetails = (offer: Promotion) => {
    setSelectedOffer(offer);
    setShowDetailsDialog(true);
  };

  // Handle edit offer
  const handleEdit = (offer: Promotion) => {
    setSelectedOffer(offer);
    setShowEditDialog(true);
  };

  // Handle delete offer
  const handleDeleteClick = (offer: Promotion) => {
    setSelectedOffer(offer);
    setShowDeleteDialog(true);
  };

  // Confirm delete offer
  const handleConfirmDelete = async (id: number) => {
    try {
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

  // Handle save edit
  const handleSaveEdit = async (values: FormValues) => {
    if (!selectedOffer) {
      toast({
        title: "Error",
        description: "No se ha seleccionado ninguna oferta para editar.",
        variant: "destructive",
      });
      return;
    } else {
      setShowEditDialog(false);
    }

    try {
      // Prepare data for the server action
      const promotionData = {
        codePromotions: values.codePromotions,
        porcentageDescuent: values.porcentageDescuent,
        dateStart: values.dateRange.from,
        dateEnd: values.dateRange.to,
        description: values.description,
        seasonId: Number.parseInt(values.seasonId),
        bedroomIds: values.bedroomIds.map((id) => Number.parseInt(id)),
      };

      // Call the server action
      const result = await updatePromotion(selectedOffer.id, promotionData);

      if (result.success) {
        // Reload offers to get the updated data
        await loadOffers();
        setShowEditDialog(false);
        toast({
          title: "Oferta actualizada",
          description: "La oferta ha sido actualizada correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo actualizar la oferta",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al actualizar oferta:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la oferta.",
        variant: "destructive",
      });
    }
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
                    <OfferRow
                      key={offer.id}
                      offer={offer}
                      onView={handleViewDetails}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DeleteOfferDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        offer={selectedOffer}
        onConfirm={handleConfirmDelete}
      />

      <OfferDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        offer={selectedOffer}
      />

      <EditOfferDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        offer={selectedOffer}
        onSubmit={handleSaveEdit}
      />
    </>
  );
}
