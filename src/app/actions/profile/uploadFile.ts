'use server';

import prisma from '@/lib/db';

export const UploadFile = async (userId: number, imageBase64: string) => {
  try {
    if (!userId || !imageBase64) {
      return { success: false, error: 'Missing required parameters' };
    }

    if (!imageBase64.startsWith('data:image/')) {
      return { success: false, error: 'Invalid image format' };
    }

    const approximateSizeInBytes = (imageBase64.length * 3) / 4;
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (approximateSizeInBytes > maxSizeInBytes) {
      return { success: false, error: 'Image is too large (max 5MB)' };
    }

    // Guarda o actualiza en la tabla UserImage
    await prisma.userImage.upsert({
      where: { userId },
      update: { image: imageBase64 },
      create: { userId, image: imageBase64 }
    });

    // Actualiza el campo image en el modelo User
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: imageBase64 },
      select: { image: true } // Solo devuelve la imagen
    });

    return { success: true, image: updatedUser.image };
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};
