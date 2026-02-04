"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export function Filter({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
}: FilterProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Definimos las opciones separadas por lógica
  const options = ["Todo", "Pendiente", "Confirmado", "Cancelado"];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedFilter("Todo");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='relative flex items-center gap-2'>
      <div className='relative w-full max-w-md'>
        <Search
          className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
          size={20}
        />
        <input
          type='text'
          placeholder='Buscar por nombre, apellido o email...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 transition-all'
        />
      </div>

      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all min-w-[140px] justify-between'
        >
          <span>{selectedFilter}</span>
          <ChevronDown size={18} />
        </button>

        {showDropdown && (
          <div className='absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 py-1'>
            {options.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterSelect(filter)}
                className='flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all'
              >
                {filter}
                {selectedFilter === filter && (
                  <Check size={16} className='text-blue-600' />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {(searchTerm || selectedFilter !== "Todo") && (
        <button
          onClick={handleClear}
          className='flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-all'
        >
          <X size={18} />
          <span>Limpiar</span>
        </button>
      )}
    </div>
  );
}

export default Filter;
