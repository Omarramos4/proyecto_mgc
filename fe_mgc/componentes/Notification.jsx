'use client';
import React, { useState, useCallback, useEffect } from 'react';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification && notification.show) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.type === 'success' ? 5000 : 7000); // Más tiempo para errores
      
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification || !notification.show) {
    return null;
  }

  const getNotificationStyles = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700',
          border: 'border-l-4 border-green-500',
          text: 'text-green-800 dark:text-green-400',
          icon: 'text-green-600 dark:text-green-400',
          button: 'text-green-500 hover:bg-green-100 dark:hover:bg-gray-600'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-700',
          border: 'border-l-4 border-red-500',
          text: 'text-red-800 dark:text-red-400',
          icon: 'text-red-600 dark:text-red-400',
          button: 'text-red-500 hover:bg-red-100 dark:hover:bg-gray-600'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-gray-800 dark:to-gray-700',
          border: 'border-l-4 border-yellow-500',
          text: 'text-yellow-800 dark:text-yellow-400',
          icon: 'text-yellow-600 dark:text-yellow-400',
          button: 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-600'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700',
          border: 'border-l-4 border-blue-500',
          text: 'text-blue-800 dark:text-blue-400',
          icon: 'text-blue-600 dark:text-blue-400',
          button: 'text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-600'
        };
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-800',
          border: 'border-l-4 border-gray-500',
          text: 'text-gray-800 dark:text-gray-400',
          icon: 'text-gray-600 dark:text-gray-400',
          button: 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'
        };
    }
  };

  const styles = getNotificationStyles();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="flex-shrink-0 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="flex-shrink-0 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="flex-shrink-0 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="flex-shrink-0 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (notification.type) {
      case 'success':
        return '¡Operación Exitosa!';
      case 'error':
        return '¡Error!';
      case 'warning':
        return '¡Advertencia!';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-[10000] max-w-md w-full transform transition-all duration-500 ease-in-out ${
      notification.show ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
    }`}>
      <div className={`${styles.bg} ${styles.border} ${styles.text} p-4 rounded-lg shadow-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-600`} role="alert">
        <div className="flex items-start">
          <div className={`${styles.icon} mr-3 mt-0.5`}>
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold mb-1">{notification.title || getTitle()}</h4>
            <p className="text-sm leading-relaxed">{notification.message}</p>
            {notification.details && (
              <p className="text-xs mt-2 opacity-80">{notification.details}</p>
            )}
          </div>
          <button 
            type="button" 
            className={`ml-3 ${styles.button} rounded-lg p-1.5 hover:scale-110 transition-all duration-200 focus:ring-2 focus:ring-offset-2`}
            onClick={onClose}
            aria-label="Cerrar notificación"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Barra de progreso para mostrar tiempo restante */}
        <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-full h-1 overflow-hidden">
          <div 
            className={`h-full ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'} transition-all duration-100 ease-linear`}
            style={{
              animation: `shrink ${notification.type === 'success' ? '5s' : '7s'} linear forwards`
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Hook personalizado para manejar notificaciones
export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', options = {}) => {
    setNotification({ 
      message, 
      type, 
      show: true,
      title: options.title,
      details: options.details
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => prev ? { ...prev, show: false } : null);
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    notification,
    showNotification,
    hideNotification,
    clearNotification,
    NotificationComponent: () => (
      <Notification 
        notification={notification} 
        onClose={hideNotification} 
      />
    )
  };
};

export default Notification;
