"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip,
    YAxis,
} from "recharts";

interface DashboardMetricCardProps {
    title: string;
    description?: string;
    value?: number | string;
    data: { name: string; value: number }[];
    color?: string;
}

export const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
    title,
    description,
    value,
    data,
    color = "#4f46e5",
}) => {
    return (
        <Card className="p-4">
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardHeader>
            <CardContent>
                {value !== undefined && <div className="text-2xl font-bold mb-2">{value}</div>}

                <div className="w-full h-20">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
