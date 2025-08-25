'use client';
import "../../globals.css";

import Header from '../../../componentes/Header';
import TablaCoberturas from '../../../componentes/TablaCoberturas';
import AddCoberturaModal from '../../../componentes/AddCoberturaModal';
import { useNotification } from '../../../componentes/Notification';
import { useState } from 'react';

// Usar el hook personalizado que incluye el filtro por sucursal
import { useCoberturas } from '../../hooks/useCoberturas';

// Prevent static generation since this page uses GraphQL queries
export const dynamic = 'force-dynamic';

export default function Coberturas() {
  const { showNotification, NotificationComponent } = useNotification();
  
  // Usar el hook personalizado que incluye filtrado por sucursal
  const { coberturas: coberturasData, loading, error } = useCoberturas();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState(null); // null significa sin filtro

  // Usar directamente los datos del hook (ya filtrados por sucursal)
  const coberturas = coberturasData || [];

  // Constante para estilos reutilizables
  const MAIN_CONTAINER_CLASSES = "w-full flex flex-col min-h-screen max-w-screen-2xl mx-auto";

  // Helper function para verificar estado
  const checkEstado = (estado, tipo) => {
    const estadoLower = estado?.toLowerCase();
    switch (tipo) {
      case 'aprobado':
        return estadoLower === 'aprobado' || estadoLower === 'activo';
      case 'pendiente':
        return estadoLower === 'pendiente';
      case 'rechazado':
        return estadoLower === 'rechazado' || estadoLower === 'denegado';
      default:
        return false;
    }
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className={MAIN_CONTAINER_CLASSES}>
        <Header title="Gestión de Coberturas" />
        <div className="flex-1 p-3 lg:p-4 relative z-[1] flex flex-col">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar errores si los hay
  if (error) {
    return (
      <div className={MAIN_CONTAINER_CLASSES}>
        <Header title="Gestión de Coberturas" />
        <div className="flex-1 p-3 lg:p-4 relative z-[1] flex flex-col">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error al cargar los datos</h3>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar coberturas basado en el término de búsqueda y estado
  const coberturasFiltradas = coberturas.filter(cobertura => {
    const searchLower = searchTerm.toLowerCase();
    
    // Filtro por término de búsqueda
    const matchesSearch = (
      cobertura.id?.toString().includes(searchLower) ||
      cobertura.cobertura?.Nombres?.toLowerCase().includes(searchLower) ||
      cobertura.cobertura?.Apellidos?.toLowerCase().includes(searchLower) ||
      cobertura.cubierto?.Nombres?.toLowerCase().includes(searchLower) ||
      cobertura.cubierto?.Apellidos?.toLowerCase().includes(searchLower) ||
      cobertura.puesto?.Descripcion?.toLowerCase().includes(searchLower) ||
      cobertura.motivo?.Descripcion?.toLowerCase().includes(searchLower) ||
      cobertura.modalidad?.Descripcion?.toLowerCase().includes(searchLower) ||
      cobertura.Estado?.toLowerCase().includes(searchLower) ||
      cobertura.solicitante?.NombreCompleto?.toLowerCase().includes(searchLower) ||
      cobertura.Justificacion?.toLowerCase().includes(searchLower)
    );
    
    // Filtro por estado
    const matchesEstado = !estadoFiltro || checkEstado(cobertura.Estado, estadoFiltro);
    
    return matchesSearch && matchesEstado;
  });

  // Contar coberturas por estado usando la función helper
  const coberturasAprobadas = coberturas.filter(cob => checkEstado(cob.Estado, 'aprobado')).length;
  const coberturasPendientes = coberturas.filter(cob => checkEstado(cob.Estado, 'pendiente')).length;
  const coberturasRechazadas = coberturas.filter(cob => checkEstado(cob.Estado, 'rechazado')).length;

  // Función para manejar el filtro por estado
  const handleEstadoFilter = (estado) => {
    if (estadoFiltro === estado) {
      // Si ya está filtrado por este estado, quitar el filtro
      setEstadoFiltro(null);
    } else {
      // Aplicar el filtro
      setEstadoFiltro(estado);
      // Limpiar búsqueda cuando se aplica filtro de estado
      setSearchTerm('');
    }
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setEstadoFiltro(null);
    setSearchTerm('');
  };

  // El manejo de revisión de cobertura ahora se hace directamente en TablaCoberturas
  // con el modal RevisarCoberturaModal

  const handleCoberturaSuccess = (cobertura) => {
    showNotification('La cobertura ha sido creada exitosamente', 'success', {
      title: '¡Cobertura Creada!',
      details: cobertura?.fechaInicio && cobertura?.fechaFin 
        ? `Periodo: ${cobertura.fechaInicio} al ${cobertura.fechaFin}`
        : 'La cobertura se procesó correctamente'
    });
  };

  const handleCoberturaError = (error) => {
    let errorMessage = 'No se pudo crear la cobertura';
    let errorTitle = 'Error al Crear Cobertura';
    let errorDetails = 'Por favor, inténtelo de nuevo o contacte al administrador si el problema persiste.';
    
    if (error?.message?.includes('ID de la cobertura')) {
      errorMessage = 'Error interno al procesar la cobertura';
      errorDetails = 'La cobertura no se pudo crear correctamente en el sistema.';
    } else if (error?.networkError) {
      errorMessage = 'Error de conexión al servidor';
      errorTitle = 'Sin Conexión';
      errorDetails = 'Verifique su conexión a internet y vuelva a intentarlo.';
    } else if (error?.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = 'Error en la validación de datos';
      errorTitle = 'Datos Inválidos';
      errorDetails = error.graphQLErrors[0].message || 'Los datos proporcionados no son válidos.';
    } else if (error?.message) {
      errorDetails = `Error técnico: ${error.message}`;
    }
    
    showNotification(errorMessage, 'error', {
      title: errorTitle,
      details: errorDetails
    });
  };


  return (
    <>
      {/* Componente de notificación global */}
      <NotificationComponent />
      
      <div className={MAIN_CONTAINER_CLASSES}>
        <Header title="Gestión de Coberturas" />
        
        <div className="flex-1 p-3 lg:p-4 relative z-[1] flex flex-col">
          {/* Header con estadísticas y búsqueda */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4 relative z-[2] flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-gray-100">
                Coberturas ({coberturasFiltradas.length})
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  onClick={() => handleEstadoFilter('aprobado')}
                  className={`text-sm font-medium px-2.5 py-0.5 rounded cursor-pointer transition-all duration-200 flex items-center ${
                    estadoFiltro === 'aprobado' 
                      ? 'bg-green-600 text-white shadow-md' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  <span>{coberturasAprobadas} Aprobadas</span>
                  {estadoFiltro === 'aprobado' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      className="ml-2 text-white text-xs font-bold w-4 h-4 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center"
                      title="Limpiar filtro"
                      style={{ lineHeight: '1' }}
                    >
                      X
                    </button>
                  )}
                </div>
                <div
                  onClick={() => handleEstadoFilter('pendiente')}
                  className={`text-sm font-medium px-2.5 py-0.5 rounded cursor-pointer transition-all duration-200 flex items-center ${
                    estadoFiltro === 'pendiente' 
                      ? 'bg-yellow-600 text-white shadow-md' 
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  }`}
                >
                  <span>{coberturasPendientes} Pendientes</span>
                  {estadoFiltro === 'pendiente' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      className="ml-2 text-white text-xs font-bold w-4 h-4 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center"
                      title="Limpiar filtro"
                      style={{ lineHeight: '1' }}
                    >
                      X
                    </button>
                  )}
                </div>
                <div
                  onClick={() => handleEstadoFilter('rechazado')}
                  className={`text-sm font-medium px-2.5 py-0.5 rounded cursor-pointer transition-all duration-200 flex items-center ${
                    estadoFiltro === 'rechazado' 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
                >
                  <span>{coberturasRechazadas} Rechazadas</span>
                  {estadoFiltro === 'rechazado' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      className="ml-2 text-white text-xs font-bold w-4 h-4 rounded-full bg-black bg-opacity-20 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center"
                      title="Limpiar filtro"
                      style={{ lineHeight: '1' }}
                    >
                      X
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              {/* Input de búsqueda */}
              <div className="relative flex-1 lg:flex-none">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[3]">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  className="block w-full lg:w-72 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 relative z-[3]" 
                  placeholder="Buscar coberturas..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 z-[3]"
                    onClick={() => setSearchTerm('')}
                  >
                    <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 14 14">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Botón Realizar Cobertura */}
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:text-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 transition-all duration-200 whitespace-nowrap relative z-30 flex-shrink-0"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span className="hidden sm:inline">Realizar Cobertura</span>
                <span className="sm:hidden">Realizar</span>
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="rounded-lg relative z-10 flex-1">
            {coberturasFiltradas.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center h-full flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="text-gray-500 text-lg font-medium">
                    {searchTerm ? 'No se encontraron coberturas' : 'No hay coberturas disponibles'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {searchTerm 
                      ? `No hay resultados para "${searchTerm}"` 
                      : estadoFiltro 
                        ? `No hay coberturas con estado "${estadoFiltro}"`
                        : 'Empieza a agregar algunas coberturas.'
                    }
                  </div>
                  {(searchTerm || estadoFiltro) && (
                    <button
                      onClick={clearAllFilters}
                      className="mt-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <TablaCoberturas 
                datos={coberturasFiltradas}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal para agregar cobertura */}
      <AddCoberturaModal 
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleCoberturaSuccess}
        onError={handleCoberturaError}
      />
    </>
  );
}