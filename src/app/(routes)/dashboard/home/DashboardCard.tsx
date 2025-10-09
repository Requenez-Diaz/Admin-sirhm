"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  href?: string;
  type?: "users" | "rooms" | "reservations" | "services";
  extraContent?: React.ReactNode;
}

export function DashboardCard({ title, value, description, icon, href, type, extraContent }: DashboardCardProps) {
  const typeColors: Record<string, { icon: string; hover: string }> = {
    users: { icon: "text-green-500", hover: "hover:bg-green-100" },
    rooms: { icon: "text-purple-500", hover: "hover:bg-purple-100" },
    reservations: { icon: "text-blue-500", hover: "hover:bg-blue-100" },
    services: { icon: "text-yellow-500", hover: "hover:bg-yellow-100" },
  };

  const colors = type ? typeColors[type] : { icon: "text-gray-500", hover: "hover:bg-gray-100" };

  const content = (
    <Card className={`cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95 ${colors.hover}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={colors.icon}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {extraContent && <div className="mt-1">{extraContent}</div>}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
