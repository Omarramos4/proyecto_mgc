'use client';
import React from 'react';

// Componente de loading optimizado para mejorar LCP
const OptimizedLoader = ({ 
  size = 'medium', 
  text = 'Cargando...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm'
    : 'flex items-center justify-center p-4';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {/* Spinner optimizado con CSS puro */}
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 border-2 border-gray-300 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Texto de loading */}
        {text && (
          <p className="text-sm text-gray-300 font-medium">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Skeleton específico para tablas
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="animate-pulse">
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Header skeleton */}
      <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(columns)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Rows skeleton */}
      <div className="divide-y divide-gray-600">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-4 py-3">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(columns)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton para cards
export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default OptimizedLoader;
