import { getSupabaseBrowserClient } from "./client";

const BUCKET_NAME = "images";

export type UploadResult = {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
};

/**
 * Sube una imagen a Supabase Storage
 * @param file - Archivo a subir
 * @param folder - Carpeta dentro del bucket (opcional)
 * @returns URL pública de la imagen o error
 */
export async function uploadImage(
  file: File,
  folder: string = ""
): Promise<UploadResult> {
  try {
    const supabase = getSupabaseBrowserClient();

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${randomString}.${fileExt}`;

    // Path completo dentro del bucket
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Subir archivo
    const { data: _data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Elimina una imagen de Supabase Storage
 * @param path - Path del archivo dentro del bucket
 */
export async function deleteImage(path: string): Promise<UploadResult> {
  try {
    const supabase = getSupabaseBrowserClient();

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtiene la URL pública de una imagen
 * @param path - Path del archivo dentro del bucket
 * @returns URL pública
 */
export function getPublicUrl(path: string): string {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  return publicUrl;
}

/**
 * Lista todos los archivos en una carpeta
 * @param folder - Carpeta dentro del bucket (opcional)
 */
export async function listImages(folder: string = "") {
  try {
    const supabase = getSupabaseBrowserClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, files: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
