import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  totalCount,
  currentCount = 10,
}) {
  if (totalPages <= 1) return null;

  const createPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 ${
              currentPage === i
                ? "z-10 bg-indigo-600 text-white"
                : "text-gray-900 hover:bg-gray-50"
            }`}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 4) ||
        (i === currentPage + 2 && currentPage < totalPages - 3)
      ) {
        pages.push(
          <span
            key={`ellipsis-${i}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset"
          >
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-3">
      {/* Showing Results */}
      <p className="text-sm text-gray-700">
        Showing{" "}
        <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
        <span className="font-medium">
          {(currentPage - 1) * 10 + currentCount}
        </span>{" "}
        of <span className="font-medium">{totalCount}</span> results
      </p>

      {/* Pagination Controls */}
      <nav
        className="isolate inline-flex -space-x-px rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {createPageNumbers()}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 disabled:opacity-50"
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
}
