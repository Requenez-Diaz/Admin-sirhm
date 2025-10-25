'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export function ActivityTab() {
    const logs = [
        { id: 1, message: 'Inicio de sesión exitoso', date: '21 Oct 2025, 08:32 AM' },
        { id: 2, message: 'Actualizaste tu foto de perfil', date: '20 Oct 2025, 10:10 PM' },
        { id: 3, message: 'Cambiaste tu contraseña', date: '18 Oct 2025, 09:22 PM' },
    ];

    return (
        <Card className="shadow-md border-blue-100">
            <CardHeader>
                <CardTitle className="text-blue-700 text-xl font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Actividad Reciente
                </CardTitle>
            </CardHeader>

            <CardContent>
                <ul className="space-y-3">
                    {logs.map((log) => (
                        <li
                            key={log.id}
                            className="border-b border-gray-200 pb-2 text-gray-700"
                        >
                            <p className="font-medium">{log.message}</p>
                            <p className="text-xs text-gray-500">{log.date}</p>
                        </li>
                    ))}
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                    Aquí podrás ver tus acciones recientes dentro del sistema.
                </p>
            </CardContent>
        </Card>
    );
}
