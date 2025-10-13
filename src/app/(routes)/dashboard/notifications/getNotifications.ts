// "use server";

// import prisma from "@/lib/db";

// export type NotificationType =
//     | "NEW_USER"
//     | "PROFILE_UPDATED"
//     | "ROOM_TYPE_CHANGED"
//     | "NEW_RESERVATION";

// export interface Notification {
//     id: string;
//     type: NotificationType;
//     message: string;
//     createdAt: string;
//     relatedUserId?: string;
//     reservationId?: string;
//     isRead: boolean;
//     user?: { username: string; image?: string };
// }

// export const getNotifications = async (): Promise<Notification[]> => {
//     try {
//         const notifications = await prisma.notification.findMany({
//             orderBy: { createdAt: "desc" },
//             include: {
//                 user: { select: { username: true, image: true } },
//                 reservation: {
//                     select: {
//                         id: true,
//                     },
//                 },
//             },
//         });

//         return notifications.map((n) => ({
//             id: n.id.toString(),
//             type: n.type as NotificationType,
//             message: n.message,
//             createdAt: n.createdAt.toISOString(),
//             relatedUserId: n.userId ? n.userId.toString() : undefined,
//             reservationId: n.reservationId ? n.reservationId.toString() : undefined,
//             isRead: n.isRead,
//             user: n.user
//                 ? {
//                     username: n.user.username,
//                     image: n.user.image ?? undefined,
//                 }
//                 : undefined,
//         }));
//     } catch (error) {
//         console.error("Error al obtener notificaciones:", error);
//         return [];
//     }
// };
