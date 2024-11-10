import { object, string } from "zod";

export const loginSchema = object({
  email: string({ required_error: "El email es requerido" })
    .min(1, "El email es requerido")
    .email("El email no es válido"),
  password: string({ required_error: "Contraseña incorrecta" })
    .min(1, "La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(32, "La contraseña debe tener menos de 32 caracteres"),
});
