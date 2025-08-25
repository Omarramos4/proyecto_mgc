/**
 * Hook personalizado para obtener datos específicos del usuario
 * Proporciona una interfaz simple para componentes que necesitan datos del usuario
 */

import { useUser } from '../context/UserContext';

/**
 * Hook que proporciona los datos del usuario de manera compatible con el código existente
 */
export const useUserData = () => {
  const { user, loading, error, isAuthenticated } = useUser();
  
  return {
    usuario: user, // Mantener el nombre original para compatibilidad
    loading,
    error,
    isAuthenticated
  };
};

/**
 * Hook específico para obtener información de sucursal
 * Reemplaza getUserSucursalId y funciones relacionadas
 */
export const useUserSucursal = () => {
  const { user, loading, error } = useUser();
  
  return {
    sucursalId: user?.ID_sucursal || null,
    sucursalNombre: user?.sucursales?.NombreSucursal || null,
    loading,
    error,
    isFromCentralSucursal: user?.ID_sucursal === 1 || user?.ID_sucursal === "1"
  };
};

/**
 * Hook para obtener información de rol del usuario
 */
export const useUserRole = () => {
  const { user, loading, error } = useUser();
  
  return {
    rolId: user?.ID_Rol || null,
    rolNombre: user?.roles?.NombreRol || null,
    loading,
    error
  };
};
