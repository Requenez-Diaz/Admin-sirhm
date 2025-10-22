'use client';

import type React from 'react';
import { User, Upload, ImageIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface AvatarCardProps {
  avatarSrc: string | null;
  isUploading: boolean;
  isEditing: boolean;
  name: string;
  onAvatarClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AvatarCard({
  avatarSrc,
  isUploading,
  isEditing,
  name,
  onAvatarClick,
  fileInputRef,
  onFileChange
}: AvatarCardProps) {
  const accentText = 'text-blue-600';
  const accentBg = 'bg-blue-600';

  return (
    <Card
      className={`bg-white transition-all duration-300 rounded-xl ${isEditing ? 'shadow-lg shadow-blue-200' : 'shadow-md'
        }`}
    >
      <CardHeader>
        <CardTitle
          className={`flex items-center gap-2 text-lg font-semibold ${accentText}`}
        >
          <ImageIcon className={`w-5 h-5 ${accentText}`} />
          Foto de Perfil
        </CardTitle>
        <CardDescription className="text-gray-600">
          Tu avatar ayuda a identificar tu cuenta en toda la aplicación.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 py-6">
        <div className="relative group">
          <Avatar
            className={`w-36 h-36 relative transition-all duration-300 ${isEditing
                ? 'cursor-pointer ring-4 ring-blue-300 ring-offset-4 ring-offset-white hover:ring-blue-400 hover:scale-105'
                : 'ring-2 ring-gray-200'
              }`}
            onClick={onAvatarClick}
          >
            {avatarSrc ? (
              <AvatarImage
                src={avatarSrc || '/placeholder.svg'}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-white">
              <User className={`w-14 h-14 ${accentText}`} />
            </AvatarFallback>

            {isUploading && (
              <div
                className={`absolute inset-0 ${accentBg} rounded-full flex items-center justify-center bg-opacity-80`}
              >
                <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {isEditing && !isUploading && (
              <div className="absolute inset-0 bg-blue-600/70 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <Upload className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            )}
          </Avatar>

          {isEditing && (
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-700/50 border-4 border-white">
              <Upload size={18} strokeWidth={2.5} />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
            disabled={isUploading || !isEditing}
          />
        </div>

        <div className="text-center space-y-1 max-w-xs">
          <p className="text-sm text-blue-700 leading-relaxed font-medium">
            {isEditing
              ? 'Haz clic en la imagen para cambiarla'
              : 'Presiona "Editar Perfil" para cambiar'}
          </p>
          {isEditing && (
            <p className="text-xs text-blue-500/80">
              Máximo 5MB • JPG, PNG o WebP
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
