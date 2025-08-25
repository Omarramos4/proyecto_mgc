import { useState, useEffect, useMemo } from 'react';
import { useUserSucursal } from '../../lib/user-hooks';

export function useSucursalFilterMemo(coberturas = []) {
  const [selectedSucursal, setSelectedSucursal] = useState('1');
  const { sucursalId, loading: userLoading } = useUserSucursal();

  useEffect(() => {
    if (sucursalId && !userLoading) {
      setSelectedSucursal(sucursalId.toString());
    }
  }, [sucursalId, userLoading]);

  const filteredCoberturas = useMemo(() => {
    if (!Array.isArray(coberturas)) return [];
    return coberturas.filter(cobertura => {
      const sucursalId = cobertura?.cobertura?.sucursal?.id?.toString() || cobertura?.cobertura?.ID_Sucursal?.toString();
      return sucursalId === selectedSucursal;
    });
  }, [coberturas, selectedSucursal]);

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
}
