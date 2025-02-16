"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

interface FilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

export function Filter({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter }: FilterProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = ["Name", "LastName", "Status", "Email"];

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const handleFilterSelect = (filter: string) => {
        if (selectedFilter === filter) {
            setSelectedFilter("Columns");
        } else {
            setSelectedFilter(filter);
        }
        setShowDropdown(false);
    };

    const handleClear = () => {
        setSearchTerm("");
        setSelectedFilter("Columns");
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative flex items-center gap-2">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                />
            </div>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200"
                >
                    {selectedFilter}
                    <ChevronDown size={18} />
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                        {options.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => handleFilterSelect(filter)}
                                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                            >
                                {filter}
                                {selectedFilter === filter && <Check size={18} className="text-blue-600" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                    <X size={18} className="text-white" />
                    <span>Limpiar</span>
                </button>
            )}
        </div>
    );
}

export default Filter;
