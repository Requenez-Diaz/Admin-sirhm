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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FormValues } from "../form-schema";
import { Bedroom } from "../type";

type BedroomSelectionFieldProps = {
  form: UseFormReturn<FormValues>;
  bedrooms: Bedroom[];
  selectedSeason: string;
  openBedroomSelector: boolean;
  setOpenBedroomSelector: (open: boolean) => void;
};

export function BedroomSelectionField({
  form,
  bedrooms,
  selectedSeason,
  openBedroomSelector,
  setOpenBedroomSelector,
}: BedroomSelectionFieldProps) {
  return (
    <FormField
      control={form.control}
      name='bedroomIds'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipos de Habitación</FormLabel>
          <Popover
            open={openBedroomSelector}
            onOpenChange={setOpenBedroomSelector}
          >
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={openBedroomSelector}
                  className='w-full justify-between'
                >
                  {field.value.length > 0
                    ? `${field.value.length} tipos seleccionados`
                    : "Selecciona tipos de habitación"}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
              <Command>
                <CommandInput placeholder='Buscar tipo de habitación...' />
                <CommandList>
                  <CommandEmpty>No se encontraron habitaciones.</CommandEmpty>
                  <CommandGroup>
                    {(bedrooms || []).map((bedroom) => {
                      const isSelected = field.value.includes(
                        bedroom.id.toString()
                      );
                      const price =
                        selectedSeason === "1"
                          ? bedroom.lowSeasonPrice
                          : bedroom.highSeasonPrice;

                      return (
                        <CommandItem
                          key={bedroom.id}
                          value={bedroom.typeBedroom}
                          onSelect={() => {
                            const newValue = [...field.value];
                            const bedroomIdStr = bedroom.id.toString();

                            if (isSelected) {
                              const index = newValue.indexOf(bedroomIdStr);
                              if (index !== -1) {
                                newValue.splice(index, 1);
                              }
                            } else {
                              newValue.push(bedroomIdStr);
                            }

                            field.onChange(newValue);
                          }}
                        >
                          <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center'>
                              <Checkbox checked={isSelected} className='mr-2' />
                              <span>{bedroom.typeBedroom}</span>
                            </div>
                            <span className='text-muted-foreground'>
                              ${price}
                            </span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Selecciona los tipos de habitación a los que se aplicará esta
            oferta.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
