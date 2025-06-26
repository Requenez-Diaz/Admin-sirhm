"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onImageUpload: (imagePath: string) => void;
  currentImage?: string;
  onImageRemove: () => void;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  onImageRemove,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(currentImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones del lado del cliente
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Tipo de archivo no permitido. Solo se permiten imágenes.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "El archivo es demasiado grande. Máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageUpload(result.filePath);
        toast({
          title: "Éxito",
          description: "Imagen subida correctamente.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast({
        title: "Error",
        description: "Error al subir la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
      setImagePreview("");
      onImageRemove();
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center w-full'>
        {!imagePreview ? (
          <Label
            htmlFor='uploadImage'
            className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'
            onClick={triggerFileInput}
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              {isUploading ? (
                <Loader2 className='w-8 h-8 mb-2 text-gray-500 animate-spin' />
              ) : (
                <Upload className='w-8 h-8 mb-2 text-gray-500' />
              )}
              <p className='mb-2 text-sm text-gray-500'>
                <span className='font-semibold'>
                  {isUploading ? "Subiendo..." : "Click para subir"}
                </span>
                {!isUploading && " o arrastra y suelta"}
              </p>
              <p className='text-xs text-gray-500'>PNG, JPG, GIF hasta 5MB</p>
            </div>
          </Label>
        ) : (
          <div className='relative w-full'>
            <div className='relative w-full h-48 border rounded-lg overflow-hidden'>
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt='Vista previa'
                fill
                className='object-cover'
              />
            </div>
            <Button
              type='button'
              variant='destructive'
              size='sm'
              className='absolute top-2 right-2'
              onClick={removeImage}
              disabled={isUploading}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        )}
      </div>

      <Input
        ref={fileInputRef}
        id='uploadImage'
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleImageChange}
        disabled={isUploading}
      />
    </div>
  );
}
