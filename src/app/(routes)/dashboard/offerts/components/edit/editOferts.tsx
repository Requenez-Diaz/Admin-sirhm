"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updatePromotion } from "@/app/actions/promotions/promotions-actions";

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
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

// Definir el esquema de validación
const formSchema = z.object({
  codePromotions: z.string().min(3, {
    message: "El código debe tener al menos 3 caracteres",
  }),
  porcentageDescuent: z.coerce
    .number()
    .min(1, { message: "El descuento debe ser al menos 1%" })
    .max(100, { message: "El descuento no puede ser mayor a 100%" }),
  dateStart: z.date({
    required_error: "La fecha de inicio es requerida",
  }),
  dateEnd: z.date({
    required_error: "La fecha de fin es requerida",
  }),
  description: z.string().optional(),
  seasonId: z.coerce.number({
    required_error: "La temporada es requerida",
  }),
  bedroomIds: z.array(z.number()).min(1, {
    message: "Selecciona al menos un tipo de habitación",
  }),
});

// Tipos para las props
interface EditOfferModalProps {
  offer: any;
  seasons: any[];
  bedrooms: any[];
  onSubmit: (values: any) => void;
  onOpenChange: (open: boolean) => void;
}

export function EditOfferModal({
  offer,
  seasons,
  bedrooms,
  onSubmit,

  onOpenChange,
}: EditOfferModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [availableSeasons, setAvailableSeasons] = useState<any[]>([]);
  const [availableBedrooms, setAvailableBedrooms] = useState<any[]>([]);

  // Cargar temporadas y habitaciones
  useEffect(() => {
    async function loadData() {
      try {
        // En un caso real, aquí cargarías las temporadas y habitaciones desde la API
        // Por ahora, usamos los datos proporcionados en las props

        // Obtener temporadas
        if (Array.isArray(seasons)) {
          setAvailableSeasons(seasons);
        } else if (seasons) {
          setAvailableSeasons([seasons]);
        } else {
          // Cargar desde la API si no hay datos
          const seasonsResponse = await fetch("/api/seasons");
          const seasonsData = await seasonsResponse.json();
          setAvailableSeasons(seasonsData);
        }

        // Obtener habitaciones
        if (Array.isArray(bedrooms) && bedrooms.length > 0) {
          setAvailableBedrooms(bedrooms.map((bp) => bp.bedroom));
        } else {
          // Cargar desde la API si no hay datos
          const bedroomsResponse = await fetch("/api/bedrooms");
          const bedroomsData = await bedroomsResponse.json();
          setAvailableBedrooms(bedroomsData);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios",
          variant: "destructive",
        });
      }
    }

    loadData();
  }, [seasons, bedrooms]);

  // Extraer los IDs de habitaciones seleccionadas
  const getSelectedBedroomIds = () => {
    if (offer.BedroomsPromotions && Array.isArray(offer.BedroomsPromotions)) {
      return offer.BedroomsPromotions.map((bp) => bp.bedroomId);
    }
    if (offer.bedroomPromotions && Array.isArray(offer.bedroomPromotions)) {
      return offer.bedroomPromotions.map((bp) => bp.bedroomId);
    }
    return [];
  };

  // Configurar el formulario con los valores iniciales
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codePromotions: offer.codePromotions || "",
      porcentageDescuent: offer.porcentageDescuent || 0,
      dateStart: offer.dateStart ? new Date(offer.dateStart) : new Date(),
      dateEnd: offer.dateEnd ? new Date(offer.dateEnd) : new Date(),
      description: offer.description || "",
      seasonId:
        offer.seasonId ||
        (offer.seasons ? offer.seasons.id : offer.season ? offer.season.id : 0),
      bedroomIds: getSelectedBedroomIds(),
    },
  });

  // Manejar el envío del formulario
  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Llamar a la función de actualización
      const result = await updatePromotion(offer.id, values);

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Oferta actualizada correctamente",
        });
        onSubmit(result.data);
        onOpenChange(false);
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
        description: "No se pudo actualizar la oferta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className='sm:max-w-[600px]'>
      <DialogHeader>
        <DialogTitle>Editar Oferta</DialogTitle>
        <DialogDescription>
          Actualiza los detalles de la oferta. Haz clic en guardar cuando hayas
          terminado.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className='space-y-6'
        >
          <div className='grid grid-cols-2 gap-4'>
            {/* Código de promoción */}
            <FormField
              control={form.control}
              name='codePromotions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder='VERANO2023' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Porcentaje de descuento */}
            <FormField
              control={form.control}
              name='porcentageDescuent'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento (%)</FormLabel>
                  <FormControl>
                    <Input type='number' min='1' max='100' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Fecha de inicio */}
            <FormField
              control={form.control}
              name='dateStart'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Fecha de inicio</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fecha de fin */}
            <FormField
              control={form.control}
              name='dateEnd'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Fecha de fin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          const startDate = form.getValues("dateStart");
                          return startDate && date < startDate;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Temporada */}
          <FormField
            control={form.control}
            name='seasonId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporada</FormLabel>
                <Select
                  onValueChange={(value) =>
                    field.onChange(Number.parseInt(value))
                  }
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona una temporada' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableSeasons.map((season) => (
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

          {/* Tipos de habitación */}
          <FormField
            control={form.control}
            name='bedroomIds'
            render={() => (
              <FormItem>
                <div className='mb-4'>
                  <FormLabel className='text-base'>
                    Tipos de habitación
                  </FormLabel>
                  <FormDescription>
                    Selecciona los tipos de habitación a los que se aplicará
                    esta oferta.
                  </FormDescription>
                </div>
                <div className='grid grid-cols-2 gap-2'>
                  {availableBedrooms.map((bedroom) => (
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
                                checked={field.value?.includes(bedroom.id)}
                                onCheckedChange={(checked) => {
                                  const currentValues = [
                                    ...(field.value || []),
                                  ];
                                  if (checked) {
                                    field.onChange([
                                      ...currentValues,
                                      bedroom.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentValues.filter(
                                        (value) => value !== bedroom.id
                                      )
                                    );
                                  }
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

          {/* Descripción */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe los detalles de esta oferta...'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
