"use server";

import prisma from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const uploadImageBedrooms = async (
  bedroomsId: number,
  imageBase64: string
) => {
  try {
    if (!bedroomsId || !imageBase64) {
      return {
        success: false,
        error: "Invalid input: bedroomsId and imageBase64 are required.",
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

    const approximateSizeInBytes = (imageBase64.length * 3) / 4;
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (approximateSizeInBytes > maxSizeInBytes) {
      return {
        success: false,
        error: "Image is too large (max 10MB)",
      };
    }

    if (!imageBase64.startsWith("data:image/")) {
      return {
        success: false,
        error: "Invalid image format. Must be a valid base64 image.",
      };
    }

    if (!existingBedroom.image) {
      const updatedBedroom = await prisma.bedrooms.update({
        where: { id: bedroomsId },
        data: {
          image: imageBase64,
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
      const newGalleryImage = await prisma.bedroomImages.create({
        data: {
          bedroomId: bedroomsId,
          imageContent: imageBase64,
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
    console.error("Error uploading image:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image",
    };
  }
};

function _generateImageName(
  bedroomsId: number,
  imageBase64: string,
  _originalFileName?: string
): string {
  if (_originalFileName) {
    const cleanName = sanitizeFileName(_originalFileName);
    const nameWithoutExt = cleanName.replace(/\.[^/.]+$/, "");
    const extension = getImageExtensionFromBase64(imageBase64);

    return `rm${bedroomsId}_${nameWithoutExt}.${extension}`;
  }

  const uuid = uuidv4();
  const extension = getImageExtensionFromBase64(imageBase64);

  return `rm${bedroomsId}_${uuid}.${extension}`;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 50);
}

function getImageExtensionFromBase64(base64: string): string {
  const mimeMatch = base64.match(/data:image\/([^;]+)/);
  if (mimeMatch) {
    const mimeType = mimeMatch[1];
    switch (mimeType) {
      case "jpeg":
      case "jpg":
        return "jpg";
      case "png":
        return "png";
      case "gif":
        return "gif";
      case "webp":
        return "webp";
      default:
        return "jpg";
    }
  }
  return "jpg";
}
