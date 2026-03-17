'use client';

import React from 'react';

import {
  User, KeyRound, LogOut, ImageIcon,
  Palette, Clock, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'next-auth/react';

export type SettingsTab =
  | 'general'
  | 'security'
  | 'avatar'
  | 'preferences'
  | 'activity'
  | 'support';

interface ProfileNavigationProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function ProfileNavigation({ activeTab, onTabChange }: ProfileNavigationProps) {
  const accentText = 'text-primary';
  const activeBg = 'bg-accent';
  const hoverBg = 'hover:bg-accent hover:text-accent-foreground';
  const textMuted = 'text-muted-foreground';
  const textActive = 'text-accent-foreground';

  const NavLink = ({ tab, icon, label }: { tab: SettingsTab; icon: React.ReactNode; label: string }) => (
    <button
      type="button"
      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-base transition-all duration-200 ${hoverBg} ${activeTab === tab ? `${activeBg} font-semibold ${textActive} shadow-sm` : `${textMuted}`
        }`}
      onClick={() => onTabChange(tab)}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="w-full md:w-64">
      <h2 className={`text-3xl font-bold mb-2 tracking-tight ${accentText}`}>
        Configuración
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ajusta tu cuenta y preferencias.
      </p>

      <nav className="flex flex-col gap-1 p-3 rounded-xl bg-card shadow-md">
        <NavLink tab="general" icon={<User className="h-5 w-5" />} label="General" />
        <NavLink tab="avatar" icon={<ImageIcon className="h-5 w-5" />} label="Foto de Perfil" />
        <NavLink tab="security" icon={<KeyRound className="h-5 w-5" />} label="Seguridad" />
        <NavLink tab="preferences" icon={<Palette className="h-5 w-5" />} label="Preferencias" />
        <NavLink tab="activity" icon={<Clock className="h-5 w-5" />} label="Actividad" />
        <NavLink tab="support" icon={<HelpCircle className="h-5 w-5" />} label="Soporte" />

        <Separator className="my-2 bg-border" />

        <Button
          variant="ghost"
          className="justify-start text-muted-foreground hover:text-white hover:bg-red-500/90 rounded-lg transition-colors duration-200"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar Sesión
        </Button>
      </nav>
    </div>
  );
}
