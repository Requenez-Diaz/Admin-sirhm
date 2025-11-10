'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { GeneralTab } from '@/sidebar/components/profile/cardsProfile';
import { AvatarCard } from '@/sidebar/components/profile/AvatarCard';
import { SecurityTab } from '@/sidebar/components/profile/SecurityTabs';
import { ProfileNavigation, SettingsTab } from '@/sidebar/components/profile/ProfileNavigations';
import { getUserImage } from '@/app/actions/profile/getUserImage';
import { UploadFile } from '@/app/actions/profile/uploadFile';

import { NotificationsTab } from '@/sidebar/components/profile/NotificationsTab';
import { PreferencesTab } from '@/sidebar/components/profile/PreferencesTab';
import { ActivityTab } from '@/sidebar/components/profile/ActivityTab';
import { SupportTab } from '@/sidebar/components/profile/SupportTab';

export default function Page() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const [isEditing, setIsEditing] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState({
        username: session?.user?.name || '',
        email: session?.user?.email || ''
    });

    useEffect(() => {
        if (!session?.user?.id) return;
        const fetchAvatar = async () => {
            const image = await getUserImage(Number(session.user.id));
            if (image) setAvatarSrc(image);
        };
        fetchAvatar();
    }, [session?.user?.id]);

    useEffect(() => {
        setProfileData({
            username: session?.user?.name || '',
            email: session?.user?.email || ''
        });
    }, [session]);

    const handleTabChange = (tab: SettingsTab) => setActiveTab(tab);
    const handleEditToggle = () => setIsEditing(!isEditing);
    const handleCancel = () => setIsEditing(false);

    const handleSubmit = async (data: typeof profileData) => {
        console.log('Datos enviados:', data);
        setProfileData(data);
        setIsEditing(false);
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current && isEditing) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length || !session?.user?.id) return;
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = async () => {
            const imageBase64 = reader.result as string;
            setAvatarSrc(imageBase64);
            setIsUploading(true);

            try {
                const result = await UploadFile(Number(session.user.id), imageBase64);
                if (result.success) toast.success('Imagen de perfil actualizada');
                else toast.error(result.error || 'Error al subir la imagen');
            } catch (error) {
                console.error(error);
                toast.error('Error al guardar la imagen en la base de datos');
            } finally {
                setIsUploading(false);
            }
        };

        reader.readAsDataURL(file);
    };

    const handlePasswordSubmit = async (data: {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        console.log('Nueva contraseña:', data);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            <ProfileNavigation activeTab={activeTab} onTabChange={handleTabChange} />

            <div className="flex-1">
                {activeTab === 'general' && (
                    <GeneralTab
                        defaultProfile={profileData}
                        isEditing={isEditing}
                        onEditToggle={handleEditToggle}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                )}

                {activeTab === 'avatar' && (
                    <AvatarCard
                        avatarSrc={avatarSrc}
                        isUploading={isUploading}
                        isEditing={isEditing}
                        name={profileData.username}
                        onAvatarClick={handleAvatarClick}
                        fileInputRef={fileInputRef}
                        onFileChange={handleFileChange}
                    />
                )}

                {activeTab === 'security' && <SecurityTab onPasswordSubmit={handlePasswordSubmit} />}

                {activeTab === 'notifications' && <NotificationsTab />}

                {activeTab === 'preferences' && <PreferencesTab />}

                {activeTab === 'activity' && <ActivityTab />}

                {activeTab === 'support' && <SupportTab />}
            </div>
        </div>
    );
}
