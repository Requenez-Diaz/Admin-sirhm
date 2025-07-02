import { z } from "zod";

export const FormSchema = z.object({
  typeBedroom: z.string().min(1, "Selecciona un tipo de habitación."),
  description: z.string().trim().min(1, "La descripción es obligatoria."),
  lowSeasonPrice: z.coerce.number().min(1, "El precio debe ser mayor a cero."),
  highSeasonPrice: z.coerce.number().min(1, "El precio debe ser mayor a cero."),
  numberBedroom: z.coerce
    .number()
    .min(1, "El número de habitación debe ser mayor a cero."),
  capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a cero."),
  status: z.enum(["1", "0"]).refine((val) => val !== undefined, {
    message: "El estado es obligatorio.",
  }),
  image: z.string().trim().min(1, "La imagen es obligatoria."),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
