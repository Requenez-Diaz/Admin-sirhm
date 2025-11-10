'use server';

import prisma from '@/lib/db';

export async function getUnreadNotificationsCount() {
    try {
        const count = await prisma.notification.count({
            where: { isRead: false },
        });
        return { success: true, count };
    } catch (error) {
        console.error('Error al contar notificaciones no leídas:', error);
        return { success: false, count: 0 };
    }
}
