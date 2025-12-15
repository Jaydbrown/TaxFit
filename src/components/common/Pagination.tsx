import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/helpers'; // Assuming cn utility is available
// import constants from 'node:constants'; // 🛑 REMOVED: Unused import

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    // Optional: Number of pages to show around the current page
    siblingCount?: number; 
}

// Helper to determine which page numbers to show
const getPageNumbers = (currentPage: number, totalPages: number, siblingCount: number = 1): (number | 'DOTS')[] => {
    // We aim to show: 1st page, dots (optional), middle range (2*sibling + current), dots (optional), last page.
    const totalVisiblePages = 3 + 2 * siblingCount; // 1st, Last, Current, and 2*Siblings = 5 total visible numbers (plus dots)

    // Case 1: Total pages is small enough to show all numbers
    if (totalPages <= totalVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    // The length of the middle range (including 1st/last/current/siblings)
    const rangeLength = 2 * siblingCount + 1;



    if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * siblingCount;
        const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
        return [...leftRange, 'DOTS', totalPages];
    }

    // Case 3: Only left dots needed (e.g., 1, DOTS, 7, 8, 9, 10)
    if (shouldShowLeftDots && !shouldShowRightDots) {
        // 🛑 FIX: Ensure 'rightRange' is declared with 'const' or 'let'
        const rightItemCount = 3 + 2 * siblingCount;
        const start = totalPages - rightItemCount + 1;
        
        const rightRange = Array.from({ length: rightItemCount }, (_, i) => start + i);
        return [1, 'DOTS', ...rightRange];
    }

    // Case 4: Both left and right dots needed (e.g., 1, DOTS, 5, 6, 7, DOTS, 10)
    if (shouldShowLeftDots && shouldShowRightDots) {
        const middleRange = Array.from({ length: rangeLength }, (_, i) => leftSiblingIndex + i);
        return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }
    
    // Default fallback (should be covered by Case 1)
    return Array.from({ length: totalPages }, (_, i) => i + 1); 
};


const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
    if (totalPages <= 1) {
        return null;
    }

    const pageNumbers = getPageNumbers(currentPage, totalPages, siblingCount);

    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    
    // Button styling helper
    const pageButtonClass = (page: number | 'DOTS') => cn(
        "px-4 py-2 mx-1 text-sm font-medium rounded-lg transition-colors duration-150",
        page === currentPage
            ? "bg-primary-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100 border border-gray-200"
    );

    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous Page"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>

            {pageNumbers.map((page, index) => {
                if (page === 'DOTS') {
                    // Use a unique key for dots. Index is usually sufficient here.
                    return <span key={`dots-${index}`} className="px-4 py-2 text-gray-500">...</span>; 
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={pageButtonClass(page as number)}
                        aria-current={page === currentPage ? 'page' : undefined}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next Page"
            >
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;