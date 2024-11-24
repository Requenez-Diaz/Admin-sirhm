"use client";

import Link from "next/link";
import { useState } from "react";
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

const links = [
  { name: "usuarios", href: "/dashboard/users", icon: UsersRound },
  { name: "habitaciones", href: "/dashboard/bedrooms", icon: LayoutDashboard },
  { name: "reservaciones", href: "/dashboard/bookings", icon: ShoppingCart },
  { name: "servicios", href: "/dashboard/services", icon: HandPlatter },
  { name: "reportes", href: "/dashboard/reports", icon: ClipboardMinus },
  { name: "configuración", href: "/dashboard/settings", icon: Settings },
  { name: "roles", href: "/dashboard/roles", icon: UsersRound },
];

interface SidebarProps {
  onStateChange: (isExpanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onStateChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const togglePin = () => {
    const newPinnedState = !isPinned;
    setIsPinned(newPinnedState);
    setIsExpanded(newPinnedState);
    onStateChange(newPinnedState);
  };

  return (
    <aside
      className={`fixed z-20 h-full top-0 left-0 pt-16 flex flex-shrink-0 flex-col transition-all duration-300 ease-in-out
        ${isExpanded || isPinned ? "w-64" : "w-20"}
        bg-gray-900`}
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
          >
            {isPinned ? (
              <PinOff className='w-6 h-6' />
            ) : (
              <Pin className='w-6 h-6' />
            )}
            {(isExpanded || isPinned) && (
              <span className='ml-3'>{isPinned ? "Unpin" : "Pin"} sidebar</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
