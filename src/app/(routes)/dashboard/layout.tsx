"use client";

import { useState } from "react";
import Sidebar from "@/sidebar/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleSidebarStateChange = (isExpanded: boolean) => {
    setIsSidebarExpanded(isExpanded);
  };

  return (
    <div className='flex h-screen overflow-hidden'>
      <Sidebar onStateChange={handleSidebarStateChange} />
      <div
        className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-64" : "ml-20"
        }`}
      >
        <main>
          <div className='pt-6 px-4'>
            <div className='w-full min-h-[calc(100vh-230px)]'>
              <div className=' shadow rounded-lg p-4 sm:p-6 xl:p-8'>
                {children}
              </div>
            </div>
          </div>
        </main>
        <footer className='bg-white md:flex md:items-center md:justify-between shadow rounded-lg p-4 md:p-6 xl:p-8 my-6 mx-4'>
          <ul className='flex items-center flex-wrap mb-6 md:mb-0'>
            <li>
              <a
                href='#'
                className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'
              >
                Terminos y Condiciones
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'
              >
                Politica de Privacidad
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-sm font-normal text-gray-500 hover:underline mr-4 md:mr-6'
              >
                Cookies
              </a>
            </li>
            <li>
              <a
                href='#'
                className='text-sm font-normal text-gray-500 hover:underline'
              >
                Contacto
              </a>
            </li>
          </ul>
          <div className='text-sm font-normal text-gray-500'>
            © 2024{" "}
            <a href='#' className='hover:underline'>
              Avimilex Requenz by Elliam Sanchez
            </a>
            . Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
