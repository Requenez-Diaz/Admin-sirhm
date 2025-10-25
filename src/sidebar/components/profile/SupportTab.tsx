'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function SupportTab() {
    return (
        <Card className="shadow-md border-blue-100">
            <CardHeader>
                <CardTitle className="text-blue-700 text-xl font-semibold">
                    Soporte y Ayuda
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 text-gray-700">
                <p>
                    ¿Tienes algún problema o duda? Nuestro equipo está disponible para ayudarte.
                </p>

                <div className="space-y-3">
                    <Button asChild variant="outline" className="w-full justify-start gap-2">
                        <Link href="mailto:soporte@sirmh.com">
                            <Mail className="w-5 h-5 text-blue-600" /> Enviar correo a soporte
                        </Link>
                    </Button>

                    <Button asChild className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                        <Link href="/ayuda">
                            <MessageSquare className="w-5 h-5 text-white" /> Ir al centro de ayuda
                        </Link>
                    </Button>
                </div>

                <p className="text-sm text-gray-500 mt-3">
                    También puedes visitar nuestra sección de preguntas frecuentes o contactarnos directamente.
                </p>
            </CardContent>
        </Card>
    );
}
