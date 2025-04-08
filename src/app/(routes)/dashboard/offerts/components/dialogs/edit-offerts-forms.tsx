"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { getAllSeasons } from "@/app/actions/getPromotions/getSeason";
import { getAllBedrooomToPromotions } from "@/app/actions/getPromotions/getAllBedrooms";
import { FormValues, Promotion, Season } from "../../type";
import { getBedroomIdsFromOffer } from "../utils/promotions-utils";

// Define the form schema
const formSchema = z.object({
  codePromotions: z
    .string()
    .min(3, "El código debe tener al menos 3 caracteres"),
  porcentageDescuent: z.coerce.number().min(1).max(100),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  seasonId: z.string().min(1, "Debes seleccionar una temporada"),
  bedroomIds: z
    .array(z.string())
    .min(1, "Debes seleccionar al menos una habitación"),
  description: z.string().optional(),
});

interface EditOfferFormProps {
  offer: Promotion;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel: () => void;
}

export function EditOfferForm({
  offer,
  onSubmit,
  onCancel,
}: EditOfferFormProps) {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [bedrooms, setBedrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load seasons and bedrooms
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [seasonsResult, bedroomsResult] = await Promise.all([
          getAllSeasons(),
          getAllBedrooomToPromotions(),
        ]);

        if (seasonsResult) {
          setSeasons(seasonsResult);
        }

        if (bedroomsResult) {
          setBedrooms(bedroomsResult);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Initialize form with offer data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codePromotions: offer.codePromotions,
      porcentageDescuent: offer.porcentageDescuent,
      dateRange: {
        from: new Date(offer.dateStart),
        to: new Date(offer.dateEnd),
      },
      seasonId: offer.seasonId?.toString() || "",
      bedroomIds: getBedroomIdsFromOffer(offer).map((id) => id.toString()),
      description: offer.description || "",
    },
  });

  // Handle form submission
  async function handleSubmit(values: FormValues) {
    await onSubmit(values);
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Code Promotion Field */}
          <FormField
            control={form.control}
            name='codePromotions'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de Promoción</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: VERANO2024' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Discount Percentage Field */}
          <FormField
            control={form.control}
            name='porcentageDescuent'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porcentaje de Descuento</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    max={100}
                    placeholder='Ej: 20'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Season Selection Field */}
          <FormField
            control={form.control}
            name='seasonId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporada</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona una temporada' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season.id} value={season.id.toString()}>
                        {season.nameSeason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Range Field */}
          <FormField
            control={form.control}
            name='dateRange'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Periodo de Validez</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value?.from ? (
                          field.value.to ? (
                            <>
                              {format(field.value.from, "dd/MM/yyyy")} -{" "}
                              {format(field.value.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(field.value.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span>Selecciona un rango de fechas</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='range'
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bedroom Selection Field */}
        <FormField
          control={form.control}
          name='bedroomIds'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>Habitaciones</FormLabel>
                <FormDescription>
                  Selecciona las habitaciones a las que se aplicará esta
                  promoción
                </FormDescription>
              </div>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {bedrooms.map((bedroom) => (
                  <FormField
                    key={bedroom.id}
                    control={form.control}
                    name='bedroomIds'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={bedroom.id}
                          className='flex flex-row items-start space-x-3 space-y-0'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                bedroom.id.toString()
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      bedroom.id.toString(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !== bedroom.id.toString()
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='font-normal'>
                            {bedroom.typeBedroom}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe los detalles de esta promoción...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end space-x-2'>
          <Button variant='outline' type='button' onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant={"success"} type='submit'>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Form>
  );
}
