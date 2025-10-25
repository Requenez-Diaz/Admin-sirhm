'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function PreferencesTab() {
    const [darkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <Card className="shadow-md border-blue-100">
            <CardHeader>
                <CardTitle className="text-blue-700 text-xl font-semibold">
                    Preferencias
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
                <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select>
                        <SelectTrigger className="w-60">
                            <SelectValue placeholder="Selecciona un idioma" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">Inglés</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Modo oscuro</Label>
                    <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={(checked) => setDarkMode(checked)}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Label htmlFor="animations">Animaciones de interfaz</Label>
                    <Switch id="animations" />
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Ajusta tus preferencias de apariencia y notificaciones.
                </p>
            </CardContent>
        </Card>
    );
}
