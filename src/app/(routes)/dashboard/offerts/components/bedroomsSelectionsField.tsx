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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../form-schema";
import type { Bedroom } from "../type";

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
      name='bedroomId' // Cambio: de 'bedroomIds' a 'bedroomId'
      render={({ field }) => {
        // Encontrar la habitación seleccionada
        const selectedBedroom = bedrooms.find(
          (bedroom) => bedroom.id.toString() === field.value
        );

        return (
          <FormItem>
            <FormLabel className='flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              Habitación Específica
            </FormLabel>
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
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {selectedBedroom ? (
                      <div className='flex items-center gap-2'>
                        <span>
                          {selectedBedroom.id} - {selectedBedroom.typeBedroom} #
                          {selectedBedroom.id}
                        </span>
                        <Badge variant='secondary' className='text-xs'>
                          ID: {selectedBedroom.id}
                        </Badge>
                      </div>
                    ) : (
                      "Seleccionar habitación específica..."
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0'>
                <Command>
                  <CommandInput placeholder='Buscar habitación...' />
                  <CommandList>
                    <CommandEmpty>No se encontraron habitaciones.</CommandEmpty>
                    <CommandGroup>
                      {(bedrooms || []).map((bedroom) => {
                        const isSelected =
                          field.value === bedroom.id.toString();

                        // Calcular precio según temporada
                        const price =
                          selectedSeason === "1"
                            ? bedroom.lowSeasonPrice
                            : bedroom.highSeasonPrice;

                        return (
                          <CommandItem
                            key={bedroom.id}
                            value={`${bedroom.typeBedroom} ${bedroom.typeBedroom} ${bedroom.highSeasonPrice}`}
                            onSelect={() => {
                              // Cambio: establecer un solo valor en lugar de manejar array
                              field.onChange(bedroom.id.toString());
                              setOpenBedroomSelector(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className='flex items-center justify-between w-full'>
                              <div className='flex flex-col'>
                                <div className='flex items-center gap-2'>
                                  <span className='font-medium'>
                                    {bedroom.typeBedroom} -{" "}
                                    {bedroom.typeBedroom} #{bedroom.id}
                                  </span>
                                  <Badge variant='outline' className='text-xs'>
                                    ID: {bedroom.id}
                                  </Badge>
                                </div>
                                <span className='text-xs text-muted-foreground'>
                                  {bedroom.typeBedroom}
                                </span>
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
              Selecciona la habitación específica para esta promoción. La
              promoción se aplicará únicamente a esta habitación por su ID
              único.
            </FormDescription>
            {selectedBedroom && (
              <div className='p-3 bg-blue-50 rounded-lg border border-blue-200'>
                <p className='text-sm text-blue-800'>
                  <strong>Habitación seleccionada:</strong>{" "}
                  {selectedBedroom.typeBedroom} - {selectedBedroom.typeBedroom}{" "}
                  #{selectedBedroom.id}
                </p>
                <p className='text-xs text-blue-600 mt-1'>
                  ID único: {selectedBedroom.id} - Esta promoción se aplicará
                  únicamente a esta habitación específica
                </p>
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
