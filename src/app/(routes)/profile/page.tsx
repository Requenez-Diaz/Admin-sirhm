'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { GeneralTab } from '@/sidebar/components/profile/cardsProfile';
import { AvatarCard } from '@/sidebar/components/profile/AvatarCard';
import { SecurityTab } from '@/sidebar/components/profile/SecurityTabs';
import { ProfileNavigation, SettingsTab } from '@/sidebar/components/profile/ProfileNavigations';

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsUploading(true);

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarSrc(reader.result as string);
            setIsUploading(false);
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

                {activeTab === 'security' && (
                    <SecurityTab onPasswordSubmit={handlePasswordSubmit} />
                )}
            </div>
        </div>
    );
}
