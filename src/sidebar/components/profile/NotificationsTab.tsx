'use client';

import { Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card';
import NotificationsPage from '@/app/(routes)/dashboard/notifications/page';

export function NotificationsTab() {

    return (
        <div className="space-y-6">

            <Card className="shadow-md border-blue-100">
                <CardHeader>
                    <CardTitle className="text-blue-700 text-xl font-semibold">
                        Tus notificaciones recientes
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <NotificationsPage />
                </CardContent>
            </Card>
        </div>
    );
}
