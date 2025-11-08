'use server';

import prisma from '@/lib/db';

export const getAllNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            image: true
          }
        },
        reservation: {
          select: {
            id: true,
            bedroomsType: true,
            arrivalDate: true,
            departureDate: true,
            status: true,
            guests: true,
            rooms: true
          }
        }
      }
    });

    return {
      success: true,
      notifications
    };
  } catch (error) {
    console.error('Error al obtener las notificaciones:', error);
    return {
      success: false,
      message: 'Error al obtener las notificaciones.',
      notifications: []
    };
  }
};
