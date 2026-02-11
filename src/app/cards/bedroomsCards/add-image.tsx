"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash2 } from "lucide-react";
import ImageUploadGallery from "./upload-file-gallery";
import { uploadGalleryImage } from "@/app/actions/uploadsImage/uploadImageGallery";

export default function GalleryImageUploader({
  bedroomId,
  initialImages = [],
  onImageUploaded,
}: any) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = async (imageData: any) => {
    setPreview(imageData.imageUrl); // Preview inmediato
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("bedroomId", bedroomId.toString());
      formData.append("imageUrl", imageData.imageUrl);
      formData.append("mimeType", imageData.mimeType);
      formData.append("fileName", imageData.fileName);

      const res = await uploadGalleryImage(null, formData);
      if (res.success) {
        toast({ title: "Imagen subida" });
        setPreview(null);
        onImageUploaded();
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='space-y-4 border-t pt-4'>
      <h3 className='text-xs font-bold uppercase text-muted-foreground'>
        Galería
      </h3>
      <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
        {initialImages.map((img: any) => (
          <div
            key={img.id}
            className='relative aspect-square rounded-md overflow-hidden border group'
          >
            <Image
              src={img.imageContent}
              alt='Gallery'
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
              <Button size='icon' variant='destructive' className='h-7 w-7'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
        ))}

        {preview && (
          <div className='relative aspect-square rounded-md overflow-hidden border animate-pulse bg-muted'>
            <Image
              src={preview}
              alt='Preview'
              fill
              className='object-cover opacity-50'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='animate-spin' />
            </div>
          </div>
        )}

        {!isUploading && (
          <div className='aspect-square'>
            <ImageUploadGallery
              onImageUpload={handleUpload}
              onImageRemove={() => {}}
              currentImage=''
            />
          </div>
        )}
      </div>
    </div>
  );
}
