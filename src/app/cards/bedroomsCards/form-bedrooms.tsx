"use client";

import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { saveBedrooms } from "@/app/actions/bedrooms";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  typeBedroom: z.string().min(1, "Selecciona un tipo de habitación."),
  description: z.string().trim().min(1, "La descripción es obligatoria."),
  lowSeasonPrice: z.coerce.number().min(1, "El precio debe ser mayor a cero."),
  highSeasonPrice: z.coerce.number().min(1, "El precio debe ser mayor a cero."),
  numberBedroom: z.coerce.number().min(1, "El número de habitación debe ser mayor a cero."),
  capacity: z.coerce.number().min(1, "La capacidad debe ser mayor a cero."),
  status: z.enum(["1", "0"]).refine((val) => val !== undefined, {
    message: "El estado es obligatorio.",
  }),
});

const FormBedrooms = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      typeBedroom: "",
      description: "",
      lowSeasonPrice: undefined,
      highSeasonPrice: undefined,
      numberBedroom: undefined,
      capacity: undefined,
      status: "1",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const response = await saveBedrooms(data);

    if (response.success) {
      toast({
        title: "Habitación registrada.",
        description: "La habitación se registró correctamente.",
      });
    } else {
      toast({
        title: "Error",
        description: response.message || "Ha ocurrido un error al registrar la habitación.",
      });
    }
  };

  return (
    <div className="max-h-screen overflow-y-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="typeBedroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de habitación</FormLabel>
                  <FormControl>
                    <select
                      id="typeBedroom"
                      {...field}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    >
                      <option value="" disabled>
                        Selecciona un tipo
                      </option>
                      {bedroomsTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Descripción de la habitación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="lowSeasonPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Temporada Baja</FormLabel>
                  <FormControl>
                    <Input
                      id="lowSeasonPrice"
                      type="number"
                      min="1"
                      placeholder="Precio temporada baja"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highSeasonPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Temporada Alta</FormLabel>
                  <FormControl>
                    <Input
                      id="highSeasonPrice"
                      type="number"
                      min="1"
                      placeholder="Precio temporada alta"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      placeholder="Capacidad de la habitación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberBedroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de habitación</FormLabel>
                  <FormControl>
                    <Input
                      id="numberBedroom"
                      type="number"
                      min="1"
                      placeholder="Número de habitación"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <select
                      id="status"
                      {...field}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button type="button" variant="success">
                <Icon action="undo" className="mr-2" />
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" variant="update">
              <Icon action="save" className="mr-2" />
              Registrar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default FormBedrooms;
