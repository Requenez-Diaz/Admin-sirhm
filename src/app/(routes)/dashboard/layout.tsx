"use client";

import type React from "react";

import { useState } from "react";

import { cn } from "@/lib/utils";
import MainSidebar from "@/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className='flex flex-col min-h-screen'>
      <MainSidebar onStateChange={setSidebarExpanded} />
      <div
        className={cn(
          "flex-1 pt-16 transition-all duration-300 ease-in-out",
          sidebarExpanded ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        <div className='p-6'>{children}</div>
      </div>

      {/* Footer */}
      <footer
        className={cn(
          "border-t py-4 px-6 text-center text-sm text-gray-500 transition-all duration-300 ease-in-out",
          sidebarExpanded ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        © 2024 Avimilex Requenz by Elliam Sanchez. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
