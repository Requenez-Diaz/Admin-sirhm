"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserProfile from "./components/usersProfile";

import {
  BedDouble,
  CalendarCheck,
  ShieldCheck,
  BarChart3,
  MessageSquareQuote,
  UsersRound,
  Pin,
  PinOff,
  Menu,
  Moon,
  Sun,
  CalendarDays,
  ReceiptText,
  Search,
} from "lucide-react";

const links = [
  { name: "usuarios", href: "/dashboard/users", icon: UsersRound },
  {
    name: "habitaciones",
    href: "/dashboard/bedrooms",
    icon: BedDouble,
  },
  {
    name: "reservaciones",
    href: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    name: "roles",
    href: "/dashboard/roles",
    icon: ShieldCheck,
  },
  {
    name: "Facturación",
    href: "/dashboard/invoices",
    icon: ReceiptText,
  },
  {
    name: "Reportes generales",
    href: "/dashboard/general-reports",
    icon: BarChart3,
  },
  {
    name: "Testimoniales",
    href: "/dashboard/testimonials",
    icon: MessageSquareQuote,
  },
  {
    name: "Tipos de habitaciones",
    href: "/dashboard/room-types",
    icon: BedDouble,
  },
  {
    name: "Temporadas",
    href: "/dashboard/seasons",
    icon: CalendarDays,
  },
  {
    name: "Disponibilidad",
    href: "/dashboard/availability",
    icon: Search,
  },
];

interface SidebarProps {
  onStateChange?: (state: boolean) => void;
}

export default function MainSidebar({ onStateChange }: SidebarProps) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    onStateChange?.(isExpanded || isPinned);
  }, [isExpanded, isPinned, onStateChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };
  const handleMouseEnter = () => !isPinned && setIsExpanded(true);
  const handleMouseLeave = () => !isPinned && setIsExpanded(false);

  return (
    <>
      <header className='fixed top-0 left-0 right-0 h-16 border-b bg-background z-40 flex items-center justify-between px-4'>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            className='lg:hidden mr-2'
            onClick={toggleMenu}
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle menu</span>
          </Button>
          <Link href='/dashboard/home' className='text-lg font-bold'>
            Dashboard
          </Link>
        </div>

        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className='mr-2'
          >
            {mounted && theme === "dark" ? (
              <Sun className='h-5 w-5' />
            ) : (
              <Moon className='h-5 w-5' />
            )}
            <span className='sr-only'>Toggle theme</span>
          </Button>

          <UserProfile />
        </div>
      </header>

      <aside
        className={cn(
          "fixed z-30 h-[calc(100vh-4rem)] top-16 left-0 flex flex-col transition-all duration-300 ease-in-out bg-background border-r",
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isExpanded || isPinned ? "w-64" : "w-16",
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex-1 overflow-y-auto'>
          <nav className='flex flex-col gap-1 p-2'>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-md py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    isExpanded || isPinned
                      ? "px-3 justify-start"
                      : "px-0 justify-center",
                  )}
                >
                  <div className='relative'>
                    <link.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive && "text-blue-600 dark:text-blue-400",
                      )}
                    />
                  </div>
                  {(isExpanded || isPinned) && (
                    <span className='ml-3 capitalize'>{link.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className='p-2 border-t'>
          <Button
            variant='ghost'
            onClick={togglePin}
            className={cn(
              "w-full flex items-center rounded-md py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground",
              isExpanded || isPinned
                ? "px-3 justify-start"
                : "px-0 justify-center",
            )}
          >
            {isPinned ? (
              <PinOff className='h-5 w-5 flex-shrink-0' />
            ) : (
              <Pin className='h-5 w-5 flex-shrink-0' />
            )}
            {(isExpanded || isPinned) && <span className='ml-3'>Anclar</span>}
          </Button>
        </div>
      </aside>

      {isMenuOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
