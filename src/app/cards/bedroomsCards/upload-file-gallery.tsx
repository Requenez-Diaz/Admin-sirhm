// src/components/bedrooms/upload-file-gallery.tsx
"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icons/icons";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onImageUpload: (imageData: {
    imageUrl: string;
    mimeType: string;
    fileName: string;
  }) => void;
  onImageRemove: () => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function ImageUploadGallery({
  onImageUpload,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>("");
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Selecciona una imagen válida.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no debe superar los 5MB.",
        variant: "destructive",
      });
      return;
    }

    // 1. Mostrar preview instantáneo
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploadingLocal(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // 2. Subir archivo a la API Route
      const response = await fetch("/api/upload", {
        // Ruta relativa es suficiente
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error en la subida al servidor (API Route).");
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error("La ruta del archivo no fue devuelta por el servidor.");
      }

      onImageUpload({
        imageUrl: data.url,
        mimeType: data.mimeType,
        fileName: data.fileName,
      });

      // 5. Limpiar input para permitir otra subida
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview("");
    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast({
        title: "Error de Subida",
        description: `Error: ${error instanceof Error ? error.message : "Desconocido"}`,
        variant: "destructive",
      });
      setPreview("");
    } finally {
      setIsUploadingLocal(false);
    }
  };

  return (
    <div className='space-y-4'>
      <Button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || isUploadingLocal}
      >
        {isUploadingLocal ? (
          <>
            <Icon action='loading' className='mr-2 animate-spin' />
            Subiendo Archivo...
          </>
        ) : (
          <>
            <Icon action='accept' className='mr-2' />
            Seleccionar Nueva Imagen
          </>
        )}
      </Button>

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
        disabled={disabled || isUploadingLocal}
      />

      {/* Vista previa de la imagen que se está subiendo */}
      {preview && (
        <div className='relative w-48 h-48 rounded-lg overflow-hidden border'>
          <Image
            src={preview || "/placeholder.svg"}
            alt='Vista previa'
            fill
            className='object-cover'
            sizes='100vw'
          />
          {isUploadingLocal && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center'>
              <Icon
                action='loading'
                className='animate-spin h-8 w-8 text-white'
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
