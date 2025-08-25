import { useState, useEffect, useMemo } from 'react';
import { useUserSucursal } from '../../lib/user-hooks';

/**
 * Hook personalizado para manejar el filtrado por sucursal
 * @param {Array} coberturas - Array de coberturas a filtrar
 * @returns {Object} - Objeto con datos filtrados y funciones de control
 */
export const useSucursalFilter = (coberturas = []) => {
  // Estado para la sucursal seleccionada (1 = Central, 2 = Regional)
  const [selectedSucursal, setSelectedSucursal] = useState('1');
  
  // Obtener datos de sucursal del usuario actual
  const { sucursalId, loading: userLoading } = useUserSucursal();
  
  // Efecto para establecer la sucursal por defecto basada en el usuario
  useEffect(() => {
    if (sucursalId && !userLoading) {
      setSelectedSucursal(sucursalId.toString());
    }
  }, [sucursalId, userLoading]);

  // Filtrar coberturas por sucursal seleccionada
  const filteredCoberturas = useMemo(() => {
    if (!Array.isArray(coberturas)) return [];
    
    return coberturas.filter(cobertura => {
      const sucursalId = cobertura?.cobertura?.sucursal?.id?.toString() || 
                        cobertura?.cobertura?.ID_Sucursal?.toString();
      return sucursalId === selectedSucursal;
    });
  }, [coberturas, selectedSucursal]);

  // Calcular estadísticas filtradas
  const estadisticas = useMemo(() => {
    const realizadas = filteredCoberturas.length;
    const rechazadas = filteredCoberturas.filter(c => c.Estado === 'Rechazado').length;
    const pendientes = filteredCoberturas.filter(c => c.Estado === 'Pendiente').length;
    const autorizadas = filteredCoberturas.filter(c => c.Estado === 'Aprobado').length;

    return {
      realizadas,
      rechazadas,
      pendientes,
      autorizadas
    };
  }, [filteredCoberturas]);

  return {
    selectedSucursal,
    setSelectedSucursal,
    filteredCoberturas,
    estadisticas
  };
};
