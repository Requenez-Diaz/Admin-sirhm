"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import React from "react";

interface InfoDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    type?: "info" | "warning" | "success";
}

export const InfoDialog: React.FC<InfoDialogProps> = ({
    open,
    onClose,
    title = "Información",
    message,
    type = "info",
}) => {
    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle2 className="text-green-500 w-6 h-6" />;
            case "warning":
                return <AlertCircle className="text-yellow-500 w-6 h-6" />;
            default:
                return <AlertCircle className="text-blue-500 w-6 h-6" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="flex items-center gap-2">
                    {getIcon()}
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-600">
                    {message}
                </DialogDescription>
                <DialogFooter>
                    <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
