"use server";

import prisma from "@/lib/db";
import { createClient } from "@supabase/supabase-js"; // 💡 Importar createClient regular para usar la Service Role Key
// import { createServerClient } from "@supabase/ssr"; // Ya no se necesita
// import { cookies } from "next/headers"; // Ya no se necesita

const BUCKET_NAME = "images";

export const uploadImageBedrooms = async (bedroomsId: number, file: File) => {
  try {
    console.log("[v0] Starting uploadImageBedrooms", {
      bedroomsId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    if (!bedroomsId || !file) {
      return {
        success: false,
        error: "Invalid input: bedroomsId and file are required.",
      };
    }

    // Validaciones de tipo y tamaño (mantener)
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error:
          "Tipo de archivo no válido. Solo se permiten imágenes JPG, PNG o WebP",
      };
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: "El archivo es demasiado grande. Máximo 5MB",
      };
    }

    const existingBedroom = await prisma.bedrooms.findUnique({
      where: { id: bedroomsId },
    });

    if (!existingBedroom) {
      return {
        success: false,
        error: "Bedroom not found.",
      };
    }

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY // 💡 ¡Verificar la Service Role Key!
    ) {
      return {
        success: false,
        error:
          "Configuración de Supabase incompleta. Verifica las variables de entorno.",
      };
    }

    // 💡 MODIFICACIÓN CLAVE: Usar la clave de Servicio (Service Role Key)
    // Usamos createClient regular, ya que no necesitamos manejar cookies de sesión de usuario
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split(".").pop();
    const fileName = `bedroom_${bedroomsId}_${timestamp}_${randomString}.${fileExt}`;
    const filePath = `bedrooms/${fileName}`;

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Supabase Storage (ahora con permisos de Service Role)
    const { data: _uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "[v0] Supabase Upload Error:",
        JSON.stringify(uploadError, null, 2)
      );
      return {
        success: false,
        error: `Error de Supabase: ${uploadError.message}`,
      };
    }

    // Obtener URL pública (usa el mismo cliente, ya tiene permisos)
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    // Actualizar registro en Prisma
    if (!existingBedroom.image) {
      const updatedBedroom = await prisma.bedrooms.update({
        where: { id: bedroomsId },
        data: {
          image: publicUrl,
          updatedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Image uploaded successfully as the primary image.",
        data: {
          id: updatedBedroom.id,
          image: updatedBedroom.image,
        },
      };
    } else {
      console.log("[v0] Creating gallery image");
      // Si ya existe imagen principal, se guarda en la galería
      const newGalleryImage = await prisma.bedroomImages.create({
        data: {
          bedroomId: bedroomsId,
          imageContent: publicUrl,
          fileName: fileName,
          mimeType: file.type,
        },
      });

      return {
        success: true,
        message: "Image uploaded successfully as a gallery image.",
        data: {
          id: newGalleryImage.id,
          imageContent: newGalleryImage.imageContent,
        },
      };
    }
  } catch (error) {
    console.error("[v0] General Upload Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
};
