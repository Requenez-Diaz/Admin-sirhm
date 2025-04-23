import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import { FormValues } from "../form-schema";

type PromotionCodeFieldProps = {
  form: UseFormReturn<FormValues>;
};

export function PromotionCodeField({ form }: PromotionCodeFieldProps) {
  return (
    <FormField
      control={form.control}
      name='codePromotions'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Código de Promoción</FormLabel>
          <FormControl>
            <Input placeholder='VERANO2025' {...field} />
          </FormControl>
          <FormDescription>
            Código que los clientes usarán para aplicar el descuento.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
