'use server';

import prisma from '@/lib/db';

export async function markAllAsRead() {
    try {
        await prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true },
        });
        return { success: true };
    } catch (error) {
        console.error('Error al marcar notificaciones como leídas:', error);
        return { success: false, message: 'Error al marcar notificaciones como leídas.' };
    }
}
