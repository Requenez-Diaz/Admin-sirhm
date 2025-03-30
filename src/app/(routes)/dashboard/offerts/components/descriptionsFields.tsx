import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import { FormValues } from "../form-schema";
type DescriptionFieldProps = {
  form: UseFormReturn<FormValues>;
};

export function DescriptionField({ form }: DescriptionFieldProps) {
  return (
    <FormField
      control={form.control}
      name='description'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Descripción (Opcional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder='Detalles adicionales sobre la oferta...'
              className='resize-none'
              {...field}
            />
          </FormControl>
          <FormDescription>
            Información adicional sobre la oferta.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
