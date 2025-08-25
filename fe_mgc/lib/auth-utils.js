/**
 * Utilidades de autenticación seguras
 * Implementa mejores prácticas para manejo de cookies y tokens
 */

import Cookies from 'js-cookie';

/**
 * Configuración segura para cookies
 */
const SECURE_COOKIE_OPTIONS = {
  expires: 1, // Reducir a 1 día máximo
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: 'strict', // Protección CSRF
  path: '/', // Disponible en toda la app
};

/**
 * Almacena solo el token de manera segura
 * Los datos del usuario se obtienen del servidor cuando se necesiten
 */
export const setAuthToken = (token) => {
  // Eliminar la cookie de usuario insegura
  if (typeof document !== 'undefined') {
    document.cookie = 'usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  
  // Solo almacenar el token
  Cookies.set('token', token, SECURE_COOKIE_OPTIONS);
  
  // Disparar evento personalizado para notificar el cambio
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userContextRefresh'));
  }
};

/**
 * Obtiene el token de autenticación
 */
export const getAuthToken = () => {
  return Cookies.get('token');
};

/**
 * Limpia todas las cookies de autenticación
 */
export const clearAuthCookies = () => {
  Cookies.remove('token', { path: '/' });
  Cookies.remove('usuario', { path: '/' });
  
  // Limpiar cookies del lado del servidor también
  if (typeof document !== 'undefined') {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'usuario=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
  
  // Disparar evento personalizado para notificar el cambio
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('userContextRefresh'));
  }
};

/**
 * Valida el token con el servidor
 */
export const validateToken = async (token) => {
  try {
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: `
          query {
            me {
              id
              NombreUsuario
              NombreCompleto
              ID_Rol
              roles { NombreRol }
              ID_sucursal
              sucursales { NombreSucursal }
            }
          }
        `
      })
    });

    const data = await response.json();
    
    if (data.errors) {
      throw new Error('Token inválido');
    }
    
    return data.data.me;
  } catch (error) {
    console.error('Error validando token:', error);
    return null;
  }
};
