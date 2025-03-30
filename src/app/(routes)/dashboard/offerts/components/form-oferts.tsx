// "use client";

// import { useState, useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { format } from "date-fns";
// import { es } from "date-fns/locale";
// import { CalendarIcon, ChevronsUpDown } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "@/components/ui/use-toast";
// import {
//   createPromotion,
//   updatePromotion,
// } from "@/app/actions/promotions/promotions-actions";
// import { getAllBedrooomToPromotions } from "@/app/actions/getPromotions/getAllBedrooms";
// import { getAllSeasons } from "@/app/actions/getPromotions/getSeason";

// // Tipos para los datos
// type Bedroom = {
//   id: number;
//   typeBedroom: string;
//   lowSeasonPrice: number;
//   highSeasonPrice: number;
// };

// type Season = {
//   id: number;
//   nameSeason: string;
//   dateStart: Date;
//   dateEnd: Date;
// };

// type OfferFormProps = {
//   onSuccess?: () => void;
//   editingOffer?: any; // Tipo para la oferta que se está editando
// };

// // Datos de ejemplo para usar mientras se cargan los datos reales
// const defaultBedrooms: Bedroom[] = [];
// const defaultSeasons: Season[] = [];

// // Form schema
// const formSchema = z.object({
//   codePromotions: z.string().min(3, {
//     message: "El código de promoción debe tener al menos 3 caracteres.",
//   }),
//   porcentageDescuent: z.coerce.number().min(1).max(100, {
//     message: "El porcentaje de descuento debe estar entre 1 y 100.",
//   }),
//   dateRange: z.object({
//     from: z.date(),
//     to: z.date(),
//   }),
//   seasonId: z.string(),
//   bedroomIds: z.array(z.string()).nonempty({
//     message: "Debes seleccionar al menos un tipo de habitación.",
//   }),
//   description: z.string().optional(),
// });

// export function OfferForm({ onSuccess, editingOffer }: OfferFormProps) {
//   const [selectedSeason, setSelectedSeason] = useState<string>("");
//   const [bedrooms, setBedrooms] = useState<Bedroom[]>(defaultBedrooms);
//   const [seasons, setSeasons] = useState<Season[]>(defaultSeasons);
//   const [openBedroomSelector, setOpenBedroomSelector] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Cargar datos usando server actions a través de una función asíncrona
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         // Crear una función asíncrona que llama a los server actions
//         const fetchServerData = async () => {
//           try {
//             // Usamos Promise.all para hacer ambas peticiones en paralelo
//             const [bedroomsResult, seasonsResult] = await Promise.all([
//               getAllBedrooomToPromotions(),
//               getAllSeasons(),
//             ]);

//             console.log("Datos obtenidos - Habitaciones:", bedroomsResult);
//             console.log("Datos obtenidos - Temporadas:", seasonsResult);

//             return {
//               bedrooms: bedroomsResult || [],
//               seasons: seasonsResult || [],
//             };
//           } catch (error) {
//             console.error("Error al obtener datos del servidor:", error);
//             return { bedrooms: [], seasons: [] };
//           }
//         };

//         // Ejecutar la función
//         const data = await fetchServerData();

//         // Actualizar los estados con los datos obtenidos
//         if (data.bedrooms && data.bedrooms.length > 0) {
//           setBedrooms(data.bedrooms);
//         }

//         if (data.seasons && data.seasons.length > 0) {
//           // Convertir las fechas de string a Date si es necesario
//           const formattedSeasons = data.seasons.map((season) => ({
//             ...season,
//             dateStart: new Date(season.dateStart),
//             dateEnd: new Date(season.dateEnd),
//           }));
//           setSeasons(formattedSeasons);
//         }
//       } catch (error) {
//         console.error("Error al cargar datos:", error);
//         toast({
//           title: "Error",
//           description: "No se pudieron cargar los datos necesarios.",
//           variant: "destructive",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Determinar si estamos editando o creando
//   const isEditing = !!editingOffer;

//   // Initialize form
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       codePromotions: editingOffer?.codePromotions || "",
//       porcentageDescuent: editingOffer?.porcentageDescuent || 10,
//       dateRange: editingOffer
//         ? {
//             from: new Date(editingOffer.dateStart),
//             to: new Date(editingOffer.dateEnd),
//           }
//         : {
//             from: new Date(),
//             to: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//           },
//       seasonId: editingOffer?.seasonId?.toString() || "",
//       bedroomIds:
//         editingOffer?.bedroomPromotions?.map((bp: any) =>
//           bp.bedroomId.toString()
//         ) || [],
//       description: editingOffer?.description || "",
//     },
//   });

//   // Establecer la temporada seleccionada al cargar el formulario
//   useEffect(() => {
//     if (editingOffer?.seasonId) {
//       setSelectedSeason(editingOffer.seasonId.toString());
//     }
//   }, [editingOffer]);

//   // Update date range when season changes
//   useEffect(() => {
//     const seasonId = form.watch("seasonId");
//     if (seasonId) {
//       const season = seasons.find((s) => s.id.toString() === seasonId);
//       if (season) {
//         form.setValue("dateRange", {
//           from: new Date(season.dateStart),
//           to: new Date(season.dateEnd),
//         });
//       }
//     }
//   }, [form.watch("seasonId"), seasons, form]);

//   // Form submission handler
//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true);

//     try {
//       // Preparar los datos para enviar
//       const dateStart = values.dateRange.from;
//       const dateEnd = values.dateRange.to;

//       // Asegurar que las fechas tienen el formato correcto
//       dateStart.setHours(0, 0, 0, 0);
//       dateEnd.setHours(23, 59, 59, 999);

//       const promotionData = {
//         codePromotions: values.codePromotions,
//         porcentageDescuent: values.porcentageDescuent,
//         dateStart: dateStart,
//         dateEnd: dateEnd,
//         description: values.description,
//         seasonId: Number.parseInt(values.seasonId),
//         bedroomIds: values.bedroomIds.map((id) => Number.parseInt(id)),
//       };

//       let result;
//       console.log("Datos de la oferta a enviar:", promotionData);

//       if (isEditing) {
//         // Actualizar promoción existente
//         result = await updatePromotion(editingOffer.id, promotionData);
//       } else {
//         // Crear nueva promoción
//         result = await createPromotion(promotionData);
//       }

//       if (result.success) {
//         toast({
//           title: isEditing ? "Oferta actualizada" : "Oferta creada",
//           description: isEditing
//             ? "La oferta ha sido actualizada correctamente."
//             : "La oferta ha sido creada correctamente.",
//         });

//         // Reset form
//         form.reset();

//         // Call onSuccess callback if provided
//         if (onSuccess) {
//           onSuccess();
//         }
//       } else {
//         toast({
//           title: "Error",
//           description:
//             result.error || "Ha ocurrido un error al procesar la oferta.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Error al procesar la oferta:", error);
//       toast({
//         title: "Error",
//         description: "Ha ocurrido un error al procesar la oferta.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   if (isLoading) {
//     return (
//       <Card className='w-full'>
//         <CardHeader>
//           <CardTitle>Cargando datos...</CardTitle>
//           <CardDescription>
//             Espera mientras cargamos la información necesaria.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className='flex justify-center items-center py-8'>
//             <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className='w-full'>
//       <CardHeader>
//         <CardTitle>
//           {isEditing ? "Editar Oferta" : "Crear Nueva Oferta"}
//         </CardTitle>
//         <CardDescription>
//           {isEditing
//             ? "Actualiza los detalles de la oferta existente."
//             : "Crea una nueva oferta para habitaciones según la temporada."}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
//               {/* Promotion Code */}
//               <FormField
//                 control={form.control}
//                 name='codePromotions'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Código de Promoción</FormLabel>
//                     <FormControl>
//                       <Input placeholder='VERANO2025' {...field} />
//                     </FormControl>
//                     <FormDescription>
//                       Código que los clientes usarán para aplicar el descuento.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Discount Percentage */}
//               <FormField
//                 control={form.control}
//                 name='porcentageDescuent'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Porcentaje de Descuento</FormLabel>
//                     <FormControl>
//                       <div className='flex items-center'>
//                         <Input type='number' min={1} max={100} {...field} />
//                         <span className='ml-2'>%</span>
//                       </div>
//                     </FormControl>
//                     <FormDescription>
//                       Porcentaje de descuento a aplicar.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Season Selection */}
//               <FormField
//                 control={form.control}
//                 name='seasonId'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Temporada</FormLabel>
//                     <Select
//                       onValueChange={(value) => {
//                         field.onChange(value);
//                         setSelectedSeason(value);
//                       }}
//                       defaultValue={field.value}
//                       value={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder='Selecciona una temporada' />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {(seasons || []).map((season) => (
//                           <SelectItem
//                             key={season.id}
//                             value={season.id.toString()}
//                           >
//                             {season.nameSeason}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormDescription>
//                       La temporada a la que se aplicará esta oferta.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Date Range */}
//               <FormField
//                 control={form.control}
//                 name='dateRange'
//                 render={({ field }) => (
//                   <FormItem className='flex flex-col'>
//                     <FormLabel>Periodo de Validez</FormLabel>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <FormControl>
//                           <Button
//                             variant={"outline"}
//                             className={cn(
//                               "w-full justify-start text-left font-normal",
//                               !field.value && "text-muted-foreground"
//                             )}
//                           >
//                             <CalendarIcon className='mr-2 h-4 w-4' />
//                             {field.value?.from ? (
//                               field.value.to ? (
//                                 <>
//                                   {format(field.value.from, "P", {
//                                     locale: es,
//                                   })}{" "}
//                                   -{" "}
//                                   {format(field.value.to, "P", { locale: es })}
//                                 </>
//                               ) : (
//                                 format(field.value.from, "P", { locale: es })
//                               )
//                             ) : (
//                               <span>Selecciona un rango de fechas</span>
//                             )}
//                           </Button>
//                         </FormControl>
//                       </PopoverTrigger>
//                       <PopoverContent className='w-auto p-0' align='start'>
//                         <Calendar
//                           mode='range'
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           initialFocus
//                           locale={es}
//                         />
//                       </PopoverContent>
//                     </Popover>
//                     <FormDescription>
//                       Periodo durante el cual la oferta estará activa.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Bedroom Selection */}
//             <FormField
//               control={form.control}
//               name='bedroomIds'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Tipos de Habitación</FormLabel>
//                   <Popover
//                     open={openBedroomSelector}
//                     onOpenChange={setOpenBedroomSelector}
//                   >
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant='outline'
//                           role='combobox'
//                           aria-expanded={openBedroomSelector}
//                           className='w-full justify-between'
//                         >
//                           {field.value.length > 0
//                             ? `${field.value.length} tipos seleccionados`
//                             : "Selecciona tipos de habitación"}
//                           <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className='w-full p-0'>
//                       <Command>
//                         <CommandInput placeholder='Buscar tipo de habitación...' />
//                         <CommandList>
//                           <CommandEmpty>
//                             No se encontraron habitaciones.
//                           </CommandEmpty>
//                           <CommandGroup>
//                             {(bedrooms || []).map((bedroom) => {
//                               const isSelected = field.value.includes(
//                                 bedroom.id.toString()
//                               );
//                               const price =
//                                 selectedSeason === "1"
//                                   ? bedroom.lowSeasonPrice
//                                   : bedroom.highSeasonPrice;

//                               return (
//                                 <CommandItem
//                                   key={bedroom.id}
//                                   value={bedroom.typeBedroom}
//                                   onSelect={() => {
//                                     const newValue = [...field.value];
//                                     const bedroomIdStr = bedroom.id.toString();

//                                     if (isSelected) {
//                                       const index =
//                                         newValue.indexOf(bedroomIdStr);
//                                       if (index !== -1) {
//                                         newValue.splice(index, 1);
//                                       }
//                                     } else {
//                                       newValue.push(bedroomIdStr);
//                                     }

//                                     field.onChange(newValue);
//                                   }}
//                                 >
//                                   <div className='flex items-center justify-between w-full'>
//                                     <div className='flex items-center'>
//                                       <Checkbox
//                                         checked={isSelected}
//                                         className='mr-2'
//                                       />
//                                       <span>{bedroom.typeBedroom}</span>
//                                     </div>
//                                     <span className='text-muted-foreground'>
//                                       ${price}
//                                     </span>
//                                   </div>
//                                 </CommandItem>
//                               );
//                             })}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   <FormDescription>
//                     Selecciona los tipos de habitación a los que se aplicará
//                     esta oferta.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Description */}
//             <FormField
//               control={form.control}
//               name='description'
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Descripción (Opcional)</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder='Detalles adicionales sobre la oferta...'
//                       className='resize-none'
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Información adicional sobre la oferta.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Preview */}
//             {form.watch("bedroomIds").length > 0 &&
//               form.watch("porcentageDescuent") &&
//               form.watch("seasonId") && (
//                 <Card className='bg-muted/50'>
//                   <CardHeader className='pb-2'>
//                     <CardTitle className='text-base'>
//                       Vista previa de la oferta
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className='space-y-2'>
//                       <div className='grid grid-cols-4 gap-2 font-medium text-sm'>
//                         <div>Tipo de Habitación</div>
//                         <div>Precio Original</div>
//                         <div>Descuento</div>
//                         <div>Precio Final</div>
//                       </div>
//                       {form.watch("bedroomIds").map((bedroomId) => {
//                         const bedroom = (bedrooms || []).find(
//                           (b) => b.id.toString() === bedroomId
//                         );
//                         if (!bedroom) return null;

//                         const isLowSeason = form.watch("seasonId") === "1";
//                         const originalPrice = isLowSeason
//                           ? bedroom.lowSeasonPrice
//                           : bedroom.highSeasonPrice;
//                         const discount =
//                           (originalPrice * form.watch("porcentageDescuent")) /
//                           100;
//                         const finalPrice = originalPrice - discount;

//                         return (
//                           <div
//                             key={bedroomId}
//                             className='grid grid-cols-4 gap-2 text-sm border-t pt-2'
//                           >
//                             <div>{bedroom.typeBedroom}</div>
//                             <div>${originalPrice}</div>
//                             <div>-${discount.toFixed(2)}</div>
//                             <div className='font-medium'>
//                               ${finalPrice.toFixed(2)}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//             <div className='flex justify-end gap-3'>
//               <Button type='button' variant='outline' onClick={onSuccess}>
//                 Cancelar
//               </Button>
//               <Button type='submit' disabled={isSubmitting}>
//                 {isSubmitting
//                   ? "Guardando..."
//                   : isEditing
//                     ? "Actualizar Oferta"
//                     : "Crear Oferta"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
