"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AlignJustify,
  ClipboardMinus,
  HandPlatter,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  UsersRound,
  X,
} from "lucide-react";
import React from "react";
import UserProfile from "./components/usersProfile";

const links = [
  { name: "usuarios", href: "users", icon: UsersRound },
  { name: "habitaciones", href: "bedrooms", icon: LayoutDashboard },
  { name: "reservaciones", href: "bookings", icon: ShoppingCart },
  { name: "servicios", href: "services", icon: HandPlatter },
  { name: "reportes", href: "reports", icon: ClipboardMinus },
  { name: "configuración", href: "settings", icon: Settings },
  { name: "roles", href: "roles" },
];

const Sidebar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <React.Fragment>
      <nav className='bg-white border-b border-gray-200 fixed z-30 w-full'>
        <div className='px-3 py-3 lg:px-5 lg:pl-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center justify-start'>
              <button
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls='sidebar'
                className='lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded'
              >
                <AlignJustify
                  className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
                />

                <X className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`} />
              </button>
              <a
                href='#'
                className='text-xl font-bold flex items-center lg:ml-2.5'
              >
                <p>Logo</p>
                <span>
                  <Link href={"/dashboard/home"}>SIRHM</Link>
                </span>
              </a>
            </div>
            <div className='flex items-center'>
              <UserProfile />
            </div>
          </div>
        </div>
      </nav>
      <div className='flex overflow-hidden bg-white pt-16'>
        <aside
          id='sidebar'
          className={`fixed z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75 ${
            isMenuOpen ? "block" : "hidden"
          } lg:block`}
          aria-label='Sidebar'
        >
          <div className='relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0'>
            <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
              <div className='flex-1 px-3 bg-white divide-y space-y-1'>
                <ul className='space-y-2 pb-2'>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className='text-base capitalize text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group'
                      >
                        {link.icon && <link.icon className='w-6 h-6' />}
                        <span className='ml-3'>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </aside>
        <div
          className={`bg-gray-900 opacity-50 ${isMenuOpen ? "block" : "hidden"} fixed inset-0 z-10`}
          id='sidebarBackdrop'
          onClick={toggleMenu}
        ></div>
      </div>
    </React.Fragment>
  );
};
export default Sidebar;
