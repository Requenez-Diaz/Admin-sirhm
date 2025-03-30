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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { UseFormReturn } from "react-hook-form";
import { FormValues } from "../form-schema";

type DateRangeFieldProps = {
  form: UseFormReturn<FormValues>;
};

export function DateRangeField({ form }: DateRangeFieldProps) {
  return (
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
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "P", {
                          locale: es,
                        })}{" "}
                        - {format(field.value.to, "P", { locale: es })}
                      </>
                    ) : (
                      format(field.value.from, "P", { locale: es })
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
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            Periodo durante el cual la oferta estará activa.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
