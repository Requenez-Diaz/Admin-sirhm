'use server';

import prisma from '@/lib/db';

interface DeleteNotificationData {
    id: number;
}

interface DeleteNotificationResponse {
    success: boolean;
    message: string;
}

export const deleteNotification = async (
    data: DeleteNotificationData
): Promise<DeleteNotificationResponse> => {
    const { id } = data;

    try {
        // Verificar si la notificación existe
        const notification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!notification) {
            return {
                success: false,
                message: 'Notificación no encontrada.'
            };
        }

        // Eliminar la notificación
        await prisma.notification.delete({
            where: { id }
        });

        return {
            success: true,
            message: 'Notificación eliminada correctamente.'
        };
    } catch (error) {
        console.error('Error al eliminar la notificación:', error);
        return {
            success: false,
            message: 'Error al eliminar la notificación.'
        };
    }
};
