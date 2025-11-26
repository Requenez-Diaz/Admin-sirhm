'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function PreferencesTab() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                        checked={mounted && theme === "dark"}
                        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
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
