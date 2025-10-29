"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
  onImageUpload: (info: { mimeType: string; fileName: string }) => void;
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
  const [objectUrl, setObjectUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setImagePreview(currentImage || "");
  }, [currentImage]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowed.includes(file.type)) {
      toast({
        title: "Error de archivo",
        description: "Tipo no permitido. Usa JPG, PNG, GIF o WEBP.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > maxSize) {
      toast({
        title: "Error de tamaño",
        description: "El archivo es muy grande. Máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const url = URL.createObjectURL(file);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      setObjectUrl(url);
      setImagePreview(url);

      // Mandamos SOLO metadatos al padre
      onImageUpload({ mimeType: file.type, fileName: file.name });

      toast({
        title: "Imagen lista",
        description: `"${file.name}" preparada.`,
      });
    } catch (e) {
      console.error(e);
      setImagePreview("");
      onImageRemove();
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast({
        title: "Error",
        description: "No se pudo procesar la imagen.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    onImageRemove();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl("");
    }
  };

  return (
    <div className='space-y-4'>
      {!imagePreview ? (
        <Label
          htmlFor='uploadImage'
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors
            ${
              disabled || isProcessing
                ? "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400"
                : "bg-gray-50 border-gray-300 hover:bg-gray-100 cursor-pointer text-gray-500"
            }`}
        >
          <div className='flex flex-col items-center justify-center pt-5 pb-6 text-center'>
            {isProcessing ? (
              <Loader2 className='w-8 h-8 mb-2 animate-spin' />
            ) : (
              <Upload className='w-8 h-8 mb-2' />
            )}
            <p className='mb-2 text-sm font-semibold'>
              {isProcessing ? "Procesando..." : "Click para subir"}
            </p>
            <p className='text-xs'>PNG, JPG, GIF, WEBP hasta 5MB</p>
          </div>
        </Label>
      ) : (
        <div className='relative w-full'>
          <div className='relative w-full h-48 border rounded-lg overflow-hidden'>
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt='Vista previa de la imagen'
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
            disabled={disabled || isProcessing}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
      )}

      <Input
        ref={fileInputRef}
        id='uploadImage'
        type='file'
        accept='image/jpeg,image/jpg,image/png,image/gif,image/webp'
        className='hidden'
        onChange={handleImageChange}
        disabled={disabled || isProcessing}
      />
    </div>
  );
}
``;
