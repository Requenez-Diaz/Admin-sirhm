"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  createPromotion,
  updatePromotion,
} from "@/app/actions/promotions/promotions-actions";

import { FormActions } from "./form-actions";
import { PromotionCodeField } from "./promotionsFields";
import { formSchema, type FormValues } from "../form-schema";
import { LoadingState } from "./loading-state";
import { DescriptionField } from "./descriptionsFields";
import { BedroomSelectionField } from "./bedroomsSelectionsField";
import { DateRangeField } from "./dateRangeFields";
import { DiscountPercentageField } from "./discountPorcentage";
import { OfferPreview } from "./offerPreview";
import { SeasonSelectionField } from "./seasonSelectionsFields";
import { useOfferFormData } from "./use-offerts-form";
import type { OfferFormProps, BedroomPromotion } from "../type"; // Import BedroomPromotion

export function OfferForm({ onSuccess, editingOffer }: OfferFormProps) {
  const { selectedSeason, setSelectedSeason, bedrooms, seasons, isLoading } =
    useOfferFormData();
  const [openBedroomSelector, setOpenBedroomSelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determinar si estamos editando o creando
  const isEditing = !!editingOffer;

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codePromotions: editingOffer?.codePromotions || "",
      porcentageDescuent: editingOffer?.porcentageDescuent || 10,
      dateRange: editingOffer
        ? {
            from: new Date(editingOffer.dateStart),
            to: new Date(editingOffer.dateEnd),
          }
        : {
            from: new Date(),
            to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
      seasonId: editingOffer?.season?.id?.toString() || "",
      bedroomIds:
        editingOffer?.bedroomPromotions?.map((bp: BedroomPromotion) =>
          bp.bedroom.id.toString()
        ) || [],
      description: editingOffer?.description || "",
    },
  });

  // Establecer la temporada seleccionada al cargar el formulario
  useEffect(() => {
    if (editingOffer?.season?.id) {
      setSelectedSeason(editingOffer.season.id.toString());
    }
  }, [editingOffer, setSelectedSeason]);

  // Update date range when season changes
  useEffect(() => {
    const seasonId = form.watch("seasonId");
    if (seasonId) {
      const season = seasons.find((s) => s.id.toString() === seasonId);
      if (season) {
        form.setValue("dateRange", {
          from: new Date(season.dateStart),
          to: new Date(season.dateEnd),
        });
      }
    }
  }, [form.watch("seasonId"), seasons, form]);

  // Form submission handler
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Preparar los datos para enviar
      const dateStart = values.dateRange.from;
      const dateEnd = values.dateRange.to;

      // Asegurar que las fechas tienen el formato correcto
      dateStart.setHours(0, 0, 0, 0);
      dateEnd.setHours(23, 59, 59, 999);

      const promotionData = {
        codePromotions: values.codePromotions,
        porcentageDescuent: values.porcentageDescuent,
        dateStart: dateStart,
        dateEnd: dateEnd,
        description: values.description,
        seasonId: Number.parseInt(values.seasonId),
        bedroomIds: values.bedroomIds.map((id) => Number.parseInt(id)),
      };

      let result;
      console.log("Datos de la oferta a enviar:", promotionData);

      if (isEditing) {
        // Actualizar promoción existente
        result = await updatePromotion(editingOffer.id, promotionData);
      } else {
        // Crear nueva promoción
        result = await createPromotion(promotionData);
      }

      if (result.success) {
        toast({
          title: isEditing ? "Oferta actualizada" : "Oferta creada",
          description: isEditing
            ? "La oferta ha sido actualizada correctamente."
            : "La oferta ha sido creada correctamente.",
        });

        // Reset form
        form.reset();

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Ha ocurrido un error al procesar la oferta.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al procesar la oferta:", error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error al procesar la oferta.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Editar Oferta" : "Crear Nueva Oferta"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Actualiza los detalles de la oferta existente."
            : "Crea una nueva oferta para habitaciones según la temporada."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <PromotionCodeField form={form} />
              <DiscountPercentageField form={form} />
              <SeasonSelectionField
                form={form}
                seasons={seasons}
                onSeasonChange={setSelectedSeason}
              />
              <DateRangeField form={form} />
            </div>

            <BedroomSelectionField
              form={form}
              bedrooms={bedrooms}
              selectedSeason={selectedSeason}
              openBedroomSelector={openBedroomSelector}
              setOpenBedroomSelector={setOpenBedroomSelector}
            />

            <DescriptionField form={form} />

            <OfferPreview watch={form.watch} bedrooms={bedrooms} />

            <FormActions
              onCancel={onSuccess}
              isSubmitting={isSubmitting}
              isEditing={isEditing}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
