"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload: (data: {
    url: string;
    mimeType: string;
    fileName: string;
  }) => void;
  onImageRemove: () => void;
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Subir archivo al servidor
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      // Notificar al componente padre con la URL del servidor
      onImageUpload({
        url: data.url,
        mimeType: data.mimeType,
        fileName: data.fileName,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove();
  };

  return (
    <div className='space-y-4'>
      <Label htmlFor='image-upload' className='text-base'>
        Imagen de la Habitación
      </Label>

      {!preview ? (
        <div className='flex flex-col items-center justify-center w-full'>
          <label
            htmlFor='image-upload'
            className='flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors'
          >
            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
              {uploading ? (
                <>
                  <Loader2 className='w-10 h-10 mb-3 text-muted-foreground animate-spin' />
                  <p className='text-sm text-muted-foreground'>
                    Subiendo imagen...
                  </p>
                </>
              ) : (
                <>
                  <Upload className='w-10 h-10 mb-3 text-muted-foreground' />
                  <p className='mb-2 text-sm text-muted-foreground'>
                    <span className='font-semibold'>Click para subir</span> o
                    arrastra y suelta
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    PNG, JPG o WebP (MAX. 5MB)
                  </p>
                </>
              )}
            </div>
            <input
              id='image-upload'
              ref={fileInputRef}
              type='file'
              className='hidden'
              accept='image/jpeg,image/jpg,image/png,image/webp'
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className='relative w-full h-64 rounded-lg overflow-hidden border border-border'>
          <Image
            src={preview || "/placeholder.svg"}
            alt='Preview'
            fill
            className='object-cover'
          />
          <Button
            type='button'
            variant='destructive'
            size='icon'
            className='absolute top-2 right-2'
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      )}

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}
