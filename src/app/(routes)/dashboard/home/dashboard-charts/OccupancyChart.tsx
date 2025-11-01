'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OccupancyChartProps {
    occupancyRate: number;
}

export function OccupancyChart({ occupancyRate }: OccupancyChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ocupación: {occupancyRate}%</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Ocupación', value: occupancyRate }]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
                            <Bar dataKey="value" fill="#8884d8" name="Ocupación" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}