/**
 * Utilitarias para el sistema
 * MIGRADO: Las funciones de usuario se han movido a user-hooks.js
 */

/**
 * @deprecated Usar el filtrado directamente en componentes con useUserSucursal()
 * Filtra una lista de recursos humanos por la sucursal del usuario logueado
 */
export const filterRecursosHumanosBySucursal = (recursosHumanos = [], sucursalId = null) => {
  console.warn('filterRecursosHumanosBySucursal está deprecado. Realiza el filtrado directamente en el componente.');
  
  if (!Array.isArray(recursosHumanos)) return [];
  
  // Si no hay ID de sucursal, no mostrar nada
  if (!sucursalId) return [];
  
  // Filtrar por ID de sucursal
  return recursosHumanos.filter(recurso => {
    const recursoSucursalId = recurso?.ID_Sucursal?.toString() || recurso?.sucursal?.id?.toString();
    return recursoSucursalId === sucursalId.toString();
  });
};

/**
 * @deprecated Usar el filtrado directamente en componentes con useUserSucursal()
 * Filtra una lista de coberturas por la sucursal del usuario logueado
 */
export const filterCoberturasBySucursal = (coberturas = [], sucursalId = null) => {
  console.warn('filterCoberturasBySucursal está deprecado. Realiza el filtrado directamente en el componente.');
  
  if (!Array.isArray(coberturas)) {
    return [];
  }
  
  // Si no hay ID de sucursal, no mostrar nada
  if (!sucursalId) {
    return [];
  }
  
  // Filtrar por sucursal del solicitante de la cobertura
  return coberturas.filter(cobertura => {
    // Obtener el ID de sucursal del solicitante
    const solicitanteSucursalId = cobertura?.solicitante?.ID_sucursal?.toString();
    return solicitanteSucursalId === sucursalId.toString();
  });
};
