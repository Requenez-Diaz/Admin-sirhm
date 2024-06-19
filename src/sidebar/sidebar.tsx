'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";

import {
    ClipboardMinus,
    HandPlatter,
    LayoutDashboard,
    Settings,
    ShoppingCart,
    UsersRound,
} from "lucide-react";
import React from "react";

const links = [
    { name: "usuarios", href: "users", icon: UsersRound },
    { name: "habitaciones", href: "bedrooms", icon: LayoutDashboard },
    { name: "reservaciones", href: "bookings", icon: ShoppingCart },
    { name: "servicios", href: "services", icon: HandPlatter },
    { name: "reportes", href: "reports", icon: ClipboardMinus },
    { name: "configuración", href: "settings", icon: Settings },
    // { name: "roles", href: "roles" },
    // { name: "Iniciar Sesion", href: "signIn" },
    // { name: "Registrarse", href: "signUp" },
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
                                <svg
                                    className={`w-6 h-6 ${isMenuOpen ? 'hidden' : 'block'}`}
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                                        clipRule='evenodd'
                                    ></path>
                                </svg>
                                <svg
                                    className={`w-6 h-6 ${isMenuOpen ? 'block' : 'hidden'}`}
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                        clipRule='evenodd'
                                    ></path>
                                </svg>
                            </button>
                            <a href='#' className='text-xl font-bold flex items-center lg:ml-2.5'>
                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256' className='h-6 w-6'>
                                    <rect width='256' height='256' fill='none'></rect>
                                    <line
                                        x1='208'
                                        y1='128'
                                        x2='128'
                                        y2='208'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='16'
                                    ></line>
                                    <line
                                        x1='192'
                                        y1='40'
                                        x2='40'
                                        y2='192'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth='16'
                                    ></line>
                                </svg>
                                <span className='self-center whitespace-nowrap ml-2'> SIRMH</span>
                            </a>
                        </div>
                        <div className='flex items-center'>
                            <span className='hidden text-right lg:block mr-4'>
                                <span className='block text-sm font-medium text-black dark:text-white'>Admin</span>
                                <span className='block text-xs'>Administrador</span>
                            </span>
                            <div className='bg-blue-500 text-white p-2 rounded-full w-12 h-12 flex items-center justify-center'>
                                <Avatar>
                                    <AvatarImage src='https://github.com/shadcn.png' />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='flex overflow-hidden bg-white pt-16'>
                <aside
                    id='sidebar'
                    className={`fixed z-20 h-full top-0 left-0 pt-16 lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75 ${isMenuOpen ? 'block' : 'hidden'
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
                    className={`bg-gray-900 opacity-50 ${isMenuOpen ? 'block' : 'hidden'} fixed inset-0 z-10`}
                    id='sidebarBackdrop'
                    onClick={toggleMenu}
                ></div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;
