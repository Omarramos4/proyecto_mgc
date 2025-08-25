'use client';
import React from 'react';

const DisableUserModal = ({ show, onClose, onConfirm, userName }) => {
  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="p-6 text-center">
            <svg className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que quieres deshabilitar a{' '}
              <span className="font-semibold">{userName}</span>?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                onClick={onConfirm}
                className="w-full sm:w-auto text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 hover:text-red-800 focus:ring-4 focus:outline-none focus:ring-red-200 font-medium rounded-lg text-sm inline-flex items-center justify-center px-5 py-2.5 text-center transition-all duration-200"
              >
                Sí, deshabilitar
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm font-medium px-5 py-2.5 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisableUserModal;
