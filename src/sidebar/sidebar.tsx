"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ClipboardMinus,
  HandPlatter,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
  Pin,
  PinOff,
} from "lucide-react";
import UserProfile from "./components/usersProfile";

const links = [
  { name: "usuarios", href: "users", icon: UsersRound },
  { name: "habitaciones", href: "bedrooms", icon: LayoutDashboard },
  { name: "reservaciones", href: "bookings", icon: ShoppingCart },
  { name: "servicios", href: "services", icon: HandPlatter },
  { name: "reportes", href: "reports", icon: ClipboardMinus },
  { name: "configuración", href: "settings", icon: Settings },
  { name: "roles", href: "roles", icon: UsersRound },
];

interface SidebarProps {
  onStateChange: (state: boolean) => void;
}

const Sidebar = ({ onStateChange }: SidebarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  useEffect(() => {
    const handleMouseEnter = () => !isPinned && setIsExpanded(true);
    const handleMouseLeave = () => !isPinned && setIsExpanded(false);

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("mouseenter", handleMouseEnter);
      sidebar.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("mouseenter", handleMouseEnter);
        sidebar.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [isPinned]);

  return (
    <>
      <nav className='bg-white border-b border-gray-200 fixed z-30 w-full'>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start'>
              <h1 className='text-lg font-semibold text-gray-900'>Dashboard</h1>
            </div>
            <div className='flex items-center '>
              <UserProfile />
            </div>
          </div>
        </div>
      </nav>
      <div className='flex overflow-hidden bg-white pt-16'>
        <aside
          ref={sidebarRef}
          id='sidebar'
          className={`fixed z-20 h-full top-0 left-0 pt-16 flex flex-shrink-0 flex-col transition-all duration-300 ease-in-out
            ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            ${isExpanded || isPinned ? "w-64" : "w-20"}
            bg-gray-900`}
          aria-label='Sidebar'
          onMouseEnter={() => {
            if (!isPinned) {
              setIsExpanded(true);
              onStateChange(true);
            }
          }}
          onMouseLeave={() => {
            if (!isPinned) {
              setIsExpanded(false);
              onStateChange(false);
            }
          }}
        >
          <div className='relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0'>
            <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
              <div className='flex-1 px-3 bg-white divide-y space-y-1'>
                <ul className='space-y-2 pb-2'>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group
                          ${isExpanded || isPinned ? "" : "justify-center"}`}
                      >
                        {link.icon && <link.icon className='w-6 h-6' />}
                        {(isExpanded || isPinned) && (
                          <span className='ml-3'>{link.name}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='p-2'>
              <button
                onClick={togglePin}
                className={`w-full flex items-center justify-center p-2 text-gray-900 rounded-lg hover:bg-gray-100
                  ${isExpanded || isPinned ? "justify-start" : "justify-center"}`}
                aria-label={isPinned ? "Unpin sidebar" : "Pin sidebar"}
              >
                {isPinned ? (
                  <PinOff className='w-6 h-6' />
                ) : (
                  <Pin className='w-6 h-6' />
                )}
                {(isExpanded || isPinned) && (
                  <span className='ml-3'>{isPinned ? "" : ""} Anclar</span>
                )}
              </button>
            </div>
          </div>
        </aside>
        {isMenuOpen && (
          <div
            className='bg-gray-900 opacity-50 fixed inset-0 z-10 lg:hidden'
            onClick={toggleMenu}
          ></div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
