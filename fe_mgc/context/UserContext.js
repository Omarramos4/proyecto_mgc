/**
 * Context Provider para el usuario autenticado
 * Proporciona datos del usuario a toda la aplicación de manera eficiente
 */

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateToken, getAuthToken, clearAuthCookies } from '../lib/auth-utils';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadUser = async (isRetry = false) => {
    setLoading(true);
    setError(null);
    
    const token = getAuthToken();
    
    if (!token) {
      setUser(null);
      setLoading(false);
      setRetryCount(0);
      return;
    }

    try {
      const userData = await validateToken(token);
      if (userData) {
        setUser(userData);
        setRetryCount(0); // Reset retry count on success
      } else {
        // Token inválido, limpiar cookies
        clearAuthCookies();
        setUser(null);
      }
    } catch (err) {
      setError(err.message);
      
      // Si es un error de red y no es un reintento, intentar una vez más
      if (!isRetry && retryCount < 2 && err.message.includes('fetch')) {
        console.log('Error de red detectado, reintentando...');
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadUser(true), 1000);
        return;
      }
      
      clearAuthCookies();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    
    // Listener para detectar cambios en las cookies (especialmente útil para tabs múltiples)
    const handleStorageChange = () => {
      loadUser();
    };

    // Escuchar eventos de storage para detectar cambios en las cookies
    window.addEventListener('storage', handleStorageChange);
    
    // También podemos escuchar un evento personalizado para refrescar el contexto
    window.addEventListener('userContextRefresh', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userContextRefresh', handleStorageChange);
    };
  }, []);

  const refreshUser = () => {
    loadUser();
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    refreshUser,
    logout,
    isAuthenticated: !!user
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
};
