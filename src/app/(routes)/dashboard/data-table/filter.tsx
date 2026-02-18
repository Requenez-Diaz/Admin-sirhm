"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

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
        <input
          type='text'
          placeholder='Buscar por nombre, apellido o email...'
          value={searchTerm}
          onChange={handleSearchChange}
          className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all'
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
          <div className='absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50 py-1'>
            {options.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterSelect(filter)}
                className='flex items-center justify-between w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-all'
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
          className='flex items-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground font-medium px-4 py-2 rounded-lg transition-all'
        >
          <X size={18} />
          <span>Limpiar</span>
        </button>
      )}
    </div>
  );
}

export default Filter;
