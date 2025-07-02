"use client";

import { bedroomsTypes } from "@/bedroomstype/bedroomsType";
import { saveBedrooms } from "@/app/actions/bedrooms";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "./upload-file";
import { uploadImageBedrooms } from "@/app/actions/uploadsImage/uploadImageBedrooms";
import { FormSchema } from "./types/schema-validations";
import { z } from "zod";

const FormBedrooms = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFileName, setImageFileName] = useState<string>("");

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
      image: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);

    try {
      const bedroomData = {
        ...data,
        image: "",
      };

      const response = await saveBedrooms(bedroomData);

      if (response.success && response.data?.id) {
        if (data.image) {
          const imageResponse = await uploadImageBedrooms(
            response.data.id,
            data.image,
            imageFileName
          );

          if (imageResponse.success) {
            toast({
              title: "Habitación registrada.",
              description: `La habitación y la imagen (${imageResponse.data?.imageName}) se registraron correctamente.`,
            });
          } else {
            toast({
              title: "Habitación registrada con advertencia.",
              description: `La habitación se registró pero hubo un error con la imagen: ${imageResponse.error}`,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Habitación registrada.",
            description: "La habitación se registró correctamente.",
          });
        }
        form.reset();
        setImageFileName("");
      } else {
        toast({
          title: "Error",
          description:
            response.message ||
            "Ha ocurrido un error al registrar la habitación.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al enviar formulario:", error);
      toast({
        title: "Error",
        description: "Error inesperado al registrar la habitación.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleImageUpload = (imageBase64: string, fileName?: string) => {
    form.setValue("image", imageBase64);
    form.clearErrors("image");
    setImageFileName(fileName || "");
  };

  const handleImageRemove = () => {
    form.setValue("image", "");
    setImageFileName("");
  };

  return (
    <div className='max-h-screen  overflow-y-auto'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid m-6 gap-4 py-4'
        >
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='typeBedroom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de habitación</FormLabel>
                  <FormControl>
                    <select
                      id='typeBedroom'
                      {...field}
                      className='border border-gray-300 rounded px-2 py-1 w-full'
                      disabled={isSubmitting}
                    >
                      <option value='' disabled>
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      id='description'
                      type='text'
                      placeholder='Descripción de la habitación'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='lowSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Temporada Baja</FormLabel>
                  <FormControl>
                    <Input
                      id='lowSeasonPrice'
                      type='number'
                      min='1'
                      placeholder='Precio temporada baja'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='highSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Temporada Alta</FormLabel>
                  <FormControl>
                    <Input
                      id='highSeasonPrice'
                      type='number'
                      min='1'
                      placeholder='Precio temporada alta'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input
                      id='capacity'
                      type='number'
                      min='1'
                      placeholder='Capacidad de la habitación'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='numberBedroom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de habitación</FormLabel>
                  <FormControl>
                    <Input
                      id='numberBedroom'
                      type='number'
                      min='1'
                      placeholder='Número de habitación'
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <select
                      id='status'
                      {...field}
                      className='border border-gray-300 rounded px-2 py-1 w-full'
                      disabled={isSubmitting}
                    >
                      <option value='1'>Activo</option>
                      <option value='0'>Inactivo</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen de la habitación</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      currentImage={field.value}
                      onImageRemove={handleImageRemove}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className='flex justify-end gap-4'>
            <DialogClose asChild>
              <Button type='button' variant='outline' disabled={isSubmitting}>
                <Icon action='undo' className='mr-2' />
                Cancelar
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icon action='loading' className='mr-2 animate-spin' />
                  Guardando...
                </>
              ) : (
                <>
                  <Icon action='save' className='mr-2' />
                  Registrar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default FormBedrooms;
