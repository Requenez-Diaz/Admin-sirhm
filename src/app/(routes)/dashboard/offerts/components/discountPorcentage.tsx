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

type DiscountPercentageFieldProps = {
  form: UseFormReturn<FormValues>;
};

export function DiscountPercentageField({
  form,
}: DiscountPercentageFieldProps) {
  return (
    <FormField
      control={form.control}
      name='porcentageDescuent'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Porcentaje de Descuento</FormLabel>
          <FormControl>
            <div className='flex items-center'>
              <Input type='number' min={1} max={100} {...field} />
              <span className='ml-2'>%</span>
            </div>
          </FormControl>
          <FormDescription>Porcentaje de descuento a aplicar.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
