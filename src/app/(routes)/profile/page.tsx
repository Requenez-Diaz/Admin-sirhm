'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Upload, User } from 'lucide-react';
import { toast } from 'sonner';
import { getUserImage } from '@/app/actions/profile/getUserImage';
import { UploadFile } from '@/app/actions/profile/uploadFile';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

    // ⚠️ Cargar la imagen desde la base de datos
    useEffect(() => {
        if (!session?.user?.id) return;

        const fetchImage = async () => {
            const image = await getUserImage(Number(session.user.id));
            if (image) setAvatarSrc(image);
        };

        fetchImage();
    }, [session?.user?.id]);

    if (status === 'loading') {
        return <p className="text-center text-gray-500 mt-10">Cargando sesión...</p>;
    }

    if (!session?.user?.id) {
        return (
            <p className="text-center text-red-500 mt-10">
                Error de sesión: no se pudo identificar tu usuario. <br />
                Por favor, inicia sesión nuevamente.
            </p>
        );
    }

    // Subir imagen
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        const reader = new FileReader();
        reader.onloadend = async () => {
            const imageBase64 = reader.result as string;
            setAvatarSrc(imageBase64);

            try {
                const result = await UploadFile(Number(session.user.id), imageBase64);

                if (result.success) {
                    toast.success('Imagen actualizada correctamente ✅');
                } else {
                    toast.error(result.error || 'Error al subir la imagen ❌');
                }
            } catch (error) {
                console.error(error);
                toast.error('Error al guardar la imagen en la base de datos');
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <Card className="shadow-lg border border-gray-200">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">Perfil de Usuario</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Avatar className="w-32 h-32 border-2 border-gray-300">
                                <AvatarImage src={avatarSrc ?? undefined} alt="Avatar del usuario" />
                                <AvatarFallback>
                                    <User className="w-12 h-12 text-gray-400" />
                                </AvatarFallback>
                            </Avatar>
                        </label>

                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                <Upload className="w-8 h-8 text-white animate-pulse" />
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <p className="text-lg font-medium">{session.user.name}</p>
                        <p className="text-sm text-gray-500">{session.user.email}</p>
                        <p className="text-sm text-gray-400 mt-1">Rol: {session.user.role}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
