"use client";

import type { FC } from "react";
import { useState } from "react";
import Image from "next/image";
import { BedroomImages } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Icon from "@/components/ui/icons/icons";
import ImageUpload from "./upload-file";
import { uploadGalleryImage } from "@/app/actions/uploadsImage/uploadImageGallery";

interface GalleryImageUploaderProps {
  bedroomId: number;
  initialImages?: BedroomImages[];
  disabled?: boolean;
  onImageUploaded: () => void;
}

const GalleryImageUploader: FC<GalleryImageUploaderProps> = ({
  bedroomId,
  initialImages = [],
  disabled = false,
  onImageUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (base64Image: string) => {
    setIsUploading(true);
    try {
      // Llamar a la acción de servidor para guardar la imagen
      const response = await uploadGalleryImage(bedroomId, base64Image);

      if (response.success) {
        toast({
          title: "Imagen de galería subida.",
          description: "La imagen se agregó a la galería.",
        });
        onImageUploaded();
      } else {
        toast({
          title: "Error al subir imagen.",
          description: response.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al subir imagen de galería:", error);
      toast({
        title: "Error inesperado.",
        description: "No se pudo subir la imagen. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Galería de Imágenes</h3>
      <div className='flex flex-wrap gap-4'>
        {initialImages.length > 0 ? (
          initialImages.map((img) => (
            <div
              key={img.id}
              className='relative w-32 h-32 rounded-lg overflow-hidden border'
            >
              <Image
                src={img.imageContent}
                alt='Imagen de la galería'
                fill
                className='object-cover'
              />
              <Button
                type='button'
                variant='destructive'
                size='sm'
                className='absolute top-1 right-1'
                onClick={() => {
                  /* Lógica de eliminación */
                }}
                disabled={disabled || isUploading}
              >
                <Icon action='delete' className='w-4 h-4' />
              </Button>
            </div>
          ))
        ) : (
          <p className='text-sm text-gray-500'>
            No hay imágenes en la galería.
          </p>
        )}
      </div>

      <div className='mt-4'>
        <ImageUpload
          onImageUpload={handleImageUpload}
          onImageRemove={() => {}}
          currentImage=''
          disabled={disabled || isUploading}
        />
        {isUploading && (
          <p className='mt-2 text-sm text-gray-500'>Subiendo imagen...</p>
        )}
      </div>
    </div>
  );
};

export default GalleryImageUploader;
