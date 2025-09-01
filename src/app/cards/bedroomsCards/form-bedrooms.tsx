"use client";

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
  const [_imageFileName, setImageFileName] = useState<string>("");

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

      if (!response.success || !response.data?.id) {
        toast({
          title: "Error",
          description:
            response.message ||
            "Ha ocurrido un error al registrar la habitación.",
          variant: "destructive",
        });
        return;
      }

      const bedroomId = response.data.id;
      let bedroomRegisteredMessage = "La habitación se registró correctamente.";

      if (data.image) {
        const imageResponse = await uploadImageBedrooms(bedroomId, data.image);

        if (imageResponse.success) {
          bedroomRegisteredMessage =
            "La habitación y la imagen se registraron correctamente.";
        } else {
          toast({
            title: "Habitación registrada con advertencia.",
            description: `La habitación se registró pero hubo un error con la imagen: ${imageResponse.error}`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Registro exitoso.",
        description: bedroomRegisteredMessage,
      });

      form.reset();
      setImageFileName("");
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
    <div className='max-h-screen overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='typeBedroom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Tipo de habitación
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='typeBedroom'
                      type='text'
                      placeholder='Escribe el tipo de habitación'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Descripción
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='description'
                      type='text'
                      placeholder='Descripción de la habitación'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='lowSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Precio Temporada Baja
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='lowSeasonPrice'
                      type='number'
                      min='1'
                      placeholder='Precio temporada baja'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='highSeasonPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Precio Temporada Alta
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='highSeasonPrice'
                      type='number'
                      min='1'
                      placeholder='Precio temporada alta'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='capacity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Capacidad
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='capacity'
                      type='number'
                      min='1'
                      placeholder='Capacidad de la habitación'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='numberBedroom'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Número de habitación
                  </FormLabel>
                  <FormControl>
                    <Input
                      id='numberBedroom'
                      type='number'
                      min='1'
                      placeholder='Número de habitación'
                      disabled={isSubmitting}
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Estado
                  </FormLabel>
                  <FormControl>
                    <select
                      id='status'
                      {...field}
                      className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-4 py-2 w-full text-gray-900 dark:text-gray-50 focus:ring-primary-500 focus:border-primary-500'
                      disabled={isSubmitting}
                    >
                      <option value='1'>Activo</option>
                      <option value='0'>Inactivo</option>
                    </select>
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700 dark:text-gray-300'>
                    Imagen de la habitación
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      onImageUpload={handleImageUpload}
                      currentImage={field.value}
                      onImageRemove={handleImageRemove}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className='text-sm font-medium text-red-500' />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className='flex flex-col sm:flex-row justify-end gap-4 mt-6'>
            <DialogClose asChild>
              <Button
                type='button'
                variant='destructive'
                disabled={isSubmitting}
              >
                <Icon action='undo' className='mr-2' />
                Cancelar
              </Button>
            </DialogClose>
            <Button type='submit' variant='success' disabled={isSubmitting}>
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
