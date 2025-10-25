'use server';

import prisma from '@/lib/db';

export const getUserImage = async (userId: number) => {
    if (!userId) return null;

    try {
        // Buscamos la imagen del usuario
        const userImage = await prisma.userImage.findUnique({
            where: { userId },
        });

        if (userImage) {
            return userImage.image;
        }

        // Si no hay imagen personalizada, devuelve null
        return null;
    } catch (error) {
        console.error('Error fetching user image:', error);
        return null;
    }
};
