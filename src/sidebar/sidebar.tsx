"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ClipboardMinus,
  HandPlatter,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
  Pin,
  PinOff,
  Menu,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserProfile from "./components/usersProfile";

const links = [
  { name: "usuarios", href: "/dashboard/users", icon: UsersRound },
  { name: "habitaciones", href: "/dashboard/bedrooms", icon: LayoutDashboard },
  { name: "reservaciones", href: "/dashboard/bookings", icon: ShoppingCart },
  { name: "servicios", href: "/dashboard/services", icon: HandPlatter },
  { name: "reportes", href: "/dashboard/reports", icon: ClipboardMinus },
  { name: "configuración", href: "/dashboard/settings", icon: Settings },
  { name: "roles", href: "/dashboard/roles", icon: User },
  { name: "Ofertas", href: "/dashboard/offerts", icon: ShoppingCart },
  {
    name: "Testimoniales",
    href: "/dashboard/testimonials",
    icon: ClipboardMinus,
  },
];

interface SidebarProps {
  onStateChange?: (state: boolean) => void;
}

export default function MainSidebar({ onStateChange }: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // Share sidebar state with parent components
  useEffect(() => {
    onStateChange?.(isExpanded || isPinned);
  }, [isExpanded, isPinned, onStateChange]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className='fixed top-0 left-0 right-0 h-16 border-b bg-white z-40 flex items-center justify-between px-4'>
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
          <h1 className='text-lg font-semibold'>Dashboard</h1>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium mr-2'>Admin</span>
          <UserProfile />
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-30 h-[calc(100vh-4rem)] top-16 left-0 flex flex-col transition-all duration-300 ease-in-out bg-white border-r",
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isExpanded || isPinned ? "w-64" : "w-16"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className='flex-1 overflow-y-auto'>
          <nav className='flex flex-col gap-1 p-2'>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center rounded-md py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors",
                  isExpanded || isPinned
                    ? "px-3 justify-start"
                    : "px-0 justify-center"
                )}
              >
                <link.icon className='h-5 w-5 flex-shrink-0' />
                {(isExpanded || isPinned) && (
                  <span className='ml-3 capitalize'>{link.name}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className='p-2 border-t'>
          <Button
            variant='ghost'
            onClick={togglePin}
            className={cn(
              "w-full flex items-center rounded-md py-2 text-sm font-medium text-gray-900 hover:bg-gray-100",
              isExpanded || isPinned
                ? "px-3 justify-start"
                : "px-0 justify-center"
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

      {/* Mobile overlay */}
      {isMenuOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/50 lg:hidden'
          onClick={toggleMenu}
        />
      )}
    </>
  );
}
