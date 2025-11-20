"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

interface UploadFileGalleryProps {
  onImageUpload: (data: {
    imageUrl: string;
    mimeType: string;
    fileName: string;
  }) => void;
  onImageRemove: () => void;
  currentImage?: string;
  disabled?: boolean;
}

export default function UploadFileGallery({
  onImageUpload,
  onImageRemove,
  currentImage,
  disabled = false,
}: UploadFileGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "bedrooms/gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("[v0] Gallery upload response:", data);

      console.log("[v0] mimeType:", data.mimeType, "fileName:", data.fileName);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al subir la imagen");
      }

      if (!data.mimeType || !data.fileName) {
        throw new Error(
          "El servidor no devolvió el tipo o nombre del archivo."
        );
      }

      onImageUpload({
        imageUrl: data.url,
        mimeType: data.mimeType,
        fileName: data.fileName,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onImageRemove();
  };

  return (
    <div className='space-y-4'>
      {currentImage && (
        <div className='flex flex-col items-center justify-center w-full'>
          <img
            src={currentImage || "/placeholder.svg"}
            alt='Uploaded Image'
            className='w-full h-32 object-cover rounded-lg'
          />
          <Button
            variant='destructive'
            className='mt-2'
            onClick={handleRemoveImage}
            disabled={uploading || disabled}
          >
            Eliminar imagen
          </Button>
        </div>
      )}

      <div className='flex flex-col items-center justify-center w-full'>
        <label
          htmlFor='gallery-image-upload'
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80 transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            {uploading ? (
              <>
                <Loader2 className='w-8 h-8 mb-2 text-muted-foreground animate-spin' />
                <p className='text-sm text-muted-foreground'>
                  Subiendo imagen...
                </p>
              </>
            ) : (
              <>
                <Upload className='w-8 h-8 mb-2 text-muted-foreground' />
                <p className='text-sm text-muted-foreground'>
                  <span className='font-semibold'>Agregar imagen</span>
                </p>
                <p className='text-xs text-muted-foreground'>
                  PNG, JPG o WebP (MAX. 5MB)
                </p>
              </>
            )}
          </div>
          <input
            id='gallery-image-upload'
            ref={fileInputRef}
            type='file'
            className='hidden'
            accept='image/jpeg,image/jpg,image/png,image/webp'
            onChange={handleFileChange}
            disabled={uploading || disabled}
          />
        </label>
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  );
}
