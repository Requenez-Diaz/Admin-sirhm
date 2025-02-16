'use client';
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <nav className="flex justify-center mt-4">
            <ul className="flex list-none">
                <li className="mx-1">
                    <button
                        onClick={handlePreviousPage}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'}`}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className="mx-1">
                        <button
                            onClick={() => onPageChange(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {i + 1}
                        </button>
                    </li>
                ))}
                <li className="mx-1">
                    <button
                        onClick={handleNextPage}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-700' : 'bg-blue-600 text-white'}`}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;