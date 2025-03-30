"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import { FormValues } from "../form-schema";
import { Season } from "../type";

type SeasonSelectionFieldProps = {
  form: UseFormReturn<FormValues>;
  seasons: Season[];
  onSeasonChange: (value: string) => void;
};

export function SeasonSelectionField({
  form,
  seasons,
  onSeasonChange,
}: SeasonSelectionFieldProps) {
  return (
    <FormField
      control={form.control}
      name='seasonId'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Temporada</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onSeasonChange(value);
            }}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Selecciona una temporada' />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(seasons || []).map((season) => (
                <SelectItem key={season.id} value={season.id.toString()}>
                  {season.nameSeason}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            La temporada a la que se aplicará esta oferta.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
