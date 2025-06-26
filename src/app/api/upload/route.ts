import { type NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No se encontró archivo",
      });
    }

    // Validar tipo de archivo
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        message: "Tipo de archivo no permitido. Solo se permiten imágenes.",
      });
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        message: "El archivo es demasiado grande. Máximo 5MB.",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear directorio si no existe
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // El directorio ya existe
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = join(uploadDir, fileName);

    // Guardar archivo
    await writeFile(filePath, buffer);

    // Retornar la ruta relativa para guardar en la base de datos
    const relativePath = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      message: "Archivo subido correctamente",
      filePath: relativePath,
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return NextResponse.json({
      success: false,
      message: "Error interno del servidor",
    });
  }
}
