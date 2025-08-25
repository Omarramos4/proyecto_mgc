import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_HONORARIOS } from '../graphql/operations';
import { useUserSucursal } from '../../lib/user-hooks';

export const useHonorariosChart = (selectedSucursal = null) => {
  const [chartData, setChartData] = useState(null);
  const { data: honorariosData, loading, error } = useQuery(GET_HONORARIOS);
  
  // Obtener sucursal del usuario actual
  const { sucursalId } = useUserSucursal();

  // Función para procesar los datos y agrupar por mes (memoizada)
  const processHonorarios = useCallback((honorarios) => {
    if (!honorarios || honorarios.length === 0) return null;

    // Usar la sucursal seleccionada o la del usuario
    const sucursalAFiltrar = selectedSucursal || sucursalId;
    
    let honorariosFiltrados = honorarios;
    
    // Filtrar por ID de sucursal seleccionada
    if (sucursalAFiltrar) {
      honorariosFiltrados = honorarios.filter(honorario => {
        const recursoSucursalId = honorario?.recursoHumano?.sucursal?.id?.toString();
        return recursoSucursalId === sucursalAFiltrar.toString();
      });
    } else {
      // Si no hay ID de sucursal, no mostrar datos
      honorariosFiltrados = [];
    }

    // Objeto para acumular pagos netos por mes
    const pagosPorMes = {};
    
    honorariosFiltrados.forEach(honorario => {
      if (honorario.fechaHora_honorario && honorario.pagoNeto) {
        try {
          // Extraer el mes y año de la fecha (manejo de diferentes formatos)
          let fecha;
          
          // Si es una fecha en formato ISO
          if (honorario.fechaHora_honorario.includes('T') || honorario.fechaHora_honorario.includes('-')) {
            fecha = new Date(honorario.fechaHora_honorario);
          } else {
            // Si es otro formato, intentar parsearlo
            fecha = new Date(honorario.fechaHora_honorario);
          }
          
          // Verificar que la fecha sea válida
          if (isNaN(fecha.getTime())) {
            // TODO: Implementar logging apropiado para fechas inválidas
            return;
          }
          
          const mesAño = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
          
          // Acumular los pagos netos
          if (!pagosPorMes[mesAño]) {
            pagosPorMes[mesAño] = 0;
          }
          pagosPorMes[mesAño] += parseFloat(honorario.pagoNeto) || 0;
        } catch (error) {
          console.warn('Error al procesar fecha:', honorario.fechaHora_honorario, error);
        }
      }
    });

    // Verificar que tengamos datos
    if (Object.keys(pagosPorMes).length === 0) return null;

    // Convertir a arrays para el gráfico
    const meses = Object.keys(pagosPorMes).sort();
    const pagosNetos = meses.map(mes => pagosPorMes[mes]);

    // Formatear las etiquetas de los meses
    const etiquetasMeses = meses.map(mes => {
      try {
        const [año, mesNum] = mes.split('-');
        const nombreMes = new Date(año, parseInt(mesNum) - 1).toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        });
        return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
      } catch (error) {
        return mes; // Fallback si hay error en el formato
      }
    });

    return {
      labels: etiquetasMeses,
      data: pagosNetos,
      totalGeneral: pagosNetos.reduce((sum, value) => sum + value, 0),
      promedioMensual: pagosNetos.length > 0 ? pagosNetos.reduce((sum, value) => sum + value, 0) / pagosNetos.length : 0,
    };
  }, [selectedSucursal, sucursalId]);

  // Efecto para procesar los datos cuando llegan o cambia la sucursal
  useEffect(() => {
    if (honorariosData && honorariosData.honorarios) {
      const processedData = processHonorarios(honorariosData.honorarios);
      setChartData(processedData);
    }
  }, [honorariosData, processHonorarios]);

  return {
    chartData,
    loading,
    error,
    honorariosData,
  };
};
