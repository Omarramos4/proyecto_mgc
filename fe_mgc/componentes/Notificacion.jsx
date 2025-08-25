'use client';
import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const Notificacion = ({ notifications = [], onClearNotification }) => {
  const [open, setOpen] = useState(false);
  const hasNotifications = notifications.length > 0;

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Mostrar notificaciones"
      >
        <Bell
          className={`w-8 h-8 transition-colors duration-300 ${
            hasNotifications 
              ? 'text-yellow-400 drop-shadow-lg animate-pulse' 
              : 'text-blue-900 hover:text-blue-800'
          }`}
        />
        {hasNotifications && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 z-[15] bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="font-bold text-gray-700 mb-2 flex justify-between items-center">
            <span>Notificaciones</span>
            {hasNotifications && (
              <button
                onClick={() => {
                  notifications.forEach((_, index) => onClearNotification?.(index));
                  setOpen(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Limpiar todo
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-sm">No hay notificaciones</div>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.map((notification, idx) => (
                <li key={idx} className="text-gray-700 text-sm bg-gray-100 rounded px-2 py-2 flex justify-between items-start">
                  <div className="flex-1">
                    <div className={`font-medium ${
                      notification.type === 'success' ? 'text-green-700' : 
                      notification.type === 'error' ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {notification.title}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {notification.timestamp || new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onClearNotification?.(idx)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificacion;
