"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onImageUpload: (imageBase64: string, fileName?: string) => void;
  currentImage?: string;
  onImageRemove: () => void;
  disabled?: boolean;
}

export default function ImageUpload({
  onImageUpload,
  currentImage,
  onImageRemove,
  disabled = false,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string>(currentImage || "");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setImagePreview(currentImage || "");
  }, [currentImage]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    setIsProcessing(true);

    try {
      const base64 = await convertFileToBase64(file);

      setImagePreview(base64);
      setCurrentFileName(file.name);
      onImageUpload(base64, file.name);

      toast({
        title: "Éxito",
        description: `Imagen "${file.name}" cargada correctamente.`,
      });
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      toast({
        title: "Error",
        description: "Error al procesar la imagen. Intenta nuevamente.",
        variant: "destructive",
      });
      setImagePreview("");
      setCurrentFileName("");
      onImageRemove();
    } finally {
      setIsProcessing(false);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error("Error al leer el archivo"));
        }
      };
      reader.onerror = () => reject(new Error("Error al leer el archivo"));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = () => {
    setImagePreview("");
    setCurrentFileName("");
    onImageRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-center w-full'>
        {!imagePreview ? (
          <Label
            htmlFor='uploadImage'
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
              disabled || isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={triggerFileInput}
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              {isProcessing ? (
                <Loader2 className='w-8 h-8 mb-2 text-gray-500 animate-spin' />
              ) : (
                <Upload className='w-8 h-8 mb-2 text-gray-500' />
              )}
              <p className='mb-2 text-sm text-gray-500'>
                <span className='font-semibold'>
                  {isProcessing ? "Procesando..." : "Click para subir"}
                </span>
                {!isProcessing && !disabled && " o arrastra y suelta"}
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
            {currentFileName && (
              <p className='text-xs text-gray-500 mt-2 truncate'>
                Archivo: {currentFileName}
              </p>
            )}
            <Button
              type='button'
              variant='destructive'
              size='sm'
              className='absolute top-2 right-2'
              onClick={removeImage}
              disabled={disabled || isProcessing}
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
        disabled={disabled || isProcessing}
      />
    </div>
  );
}
