'use server';

import prisma from '@/lib/db';

export const getAllUserNotifications = async () => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        type: 'CREATED',
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        message: true,
        type: true,
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
            guests: true,
            rooms: true,
            status: true
          }
        }
      }
    });

    return {
      success: true,
      notifications
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener notificaciones.',
      notifications: []
    };
  }
};
