'use client';

import { MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteNotification } from "@/app/actions/notification/deleteNotification";

interface NotificationMenuProps {
    notificationId: number;
    onDeleted: () => void;
}

export default function NotificationMenu({
    notificationId,
    onDeleted,
}: NotificationMenuProps) {

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await deleteNotification({ id: notificationId });
            if (response.success) onDeleted();
            else console.error("Error eliminando notificación:", response.message);
        } catch (error) {
            console.error("Error eliminando notificación:", error);
        }
    };

    const handleDisable = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log("Desactivar notificaciones");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDelete}>
                    Eliminar esta notificación
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDisable}>
                    Desactivar estas notificaciones
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
