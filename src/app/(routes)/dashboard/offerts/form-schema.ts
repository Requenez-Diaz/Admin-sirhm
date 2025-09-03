import { z } from "zod";

// Form schema
export const formSchema = z.object({
  codePromotions: z.string().min(3, {
    message: "El código de promoción debe tener al menos 3 caracteres.",
  }),
  porcentageDescuent: z.coerce.number().min(1).max(100, {
    message: "El porcentaje de descuento debe estar entre 1 y 100.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
  seasonId: z.string().min(1, "Debe seleccionar una temporada"),
  bedroomId: z.string().min(1, "Debe seleccionar una habitación"), // Cambio: de bedroomIds a bedroomId
  description: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
