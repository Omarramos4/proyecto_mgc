// componentes/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, pageNumbers, onPageChange }) => (
  <div className="flex items-center space-x-1">
    {/* Botón anterior */}
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
      aria-label="Página anterior"
    >
      Anterior
    </button>
    {/* Números de página */}
    {pageNumbers.map((page) => (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
          currentPage === page
            ? 'text-blue-600 bg-blue-50 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
            : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label={`Página ${page}`}
      >
        {page}
      </button>
    ))}
    {/* Botón siguiente */}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
      aria-label="Página siguiente"
    >
      Siguiente
    </button>
  </div>
);

export default Pagination;
