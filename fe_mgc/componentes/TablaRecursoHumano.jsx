'use client';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import EditUserModal from './EditUserModal';
import DisableUserModal from './DisableUserModal';
import { useUserSucursal } from '../lib/user-hooks';

const TablaRecursoHumano = ({ datos = [], onEditar, onDeshabilitar, filterBySucursal = false }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Hook para obtener sucursal del usuario (solo si se necesita filtrado)
  const { sucursalId, sucursalNombre } = useUserSucursal();
  
  // Filtrar datos por sucursal si está habilitado
  const datosFiltrados = useMemo(() => {
    if (!filterBySucursal || !sucursalId) {
      return datos;
    }
    
    return datos.filter(usuario => {
      // Intentar varias formas de comparar sucursal
      const usuarioSucursalId = usuario.sucursalId || usuario.ID_sucursal || usuario.id_sucursal;
      const usuarioSucursalNombre = usuario.sucursal || usuario.sucursalNombre;
      
      // Comparar por ID de sucursal
      if (usuarioSucursalId) {
        return usuarioSucursalId.toString() === sucursalId.toString();
      }
      
      // Comparar por nombre de sucursal como fallback
      if (usuarioSucursalNombre && sucursalNombre) {
        return usuarioSucursalNombre.toLowerCase().includes(sucursalNombre.toLowerCase());
      }
      
      return false;
    });
  }, [datos, filterBySucursal, sucursalId, sucursalNombre]);
  
  // Funciones helper memoizadas para evitar duplicación
  const getEstadoInfo = useCallback((estado) => {
    const isActive = estado === 1 || estado === '1';
    return {
      isActive,
      className: `inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
        isActive 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }`,
      text: isActive ? 'Activo' : 'Inactivo',
      fullText: isActive ? 'Empleado Activo' : 'Empleado Inactivo'
    };
  }, []);

  const formatValue = useCallback((value) => value || 'N/A', []);
  
  // Calcular datos paginados con useMemo para optimización
  const { totalItems, totalPages, startIndex, endIndex, datosPaginados } = useMemo(() => {
    const total = datosFiltrados.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = datosFiltrados.slice(start, end);
    
    return {
      totalItems: total,
      totalPages: pages,
      startIndex: start,
      endIndex: end,
      datosPaginados: paginated
    };
  }, [datosFiltrados, currentPage, itemsPerPage]);
  
  // Función para cambiar página - optimizada con useCallback
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);
  
  // Función para cambiar items per page - optimizada con useCallback
  const handleItemsPerPageChange = useCallback((items) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset a primera página
  }, []);
  
  // Generar números de página para mostrar - optimizado con useMemo
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (showEditModal || showDisableModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showEditModal, showDisableModal]);

  // Funciones para modales - optimizadas con useCallback
  const handleEditClick = useCallback((usuario) => {
    setSelectedUser(usuario);
    setShowEditModal(true);
  }, []);

  const handleDisableClick = useCallback((usuario) => {
    setSelectedUser(usuario);
    setShowDisableModal(true);
  }, []);

  const handleSaveEdit = useCallback((editFormData) => {
    if (onEditar) {
      onEditar(editFormData);
    }
    setShowEditModal(false);
    setSelectedUser(null);
  }, [onEditar]);

  const handleConfirmDisable = useCallback(() => {
    if (onDeshabilitar && selectedUser) {
      onDeshabilitar(selectedUser);
    }
    setShowDisableModal(false);
    setSelectedUser(null);
  }, [onDeshabilitar, selectedUser]);

  const toggleRowExpansion = useCallback((usuarioId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(usuarioId)) {
        newSet.delete(usuarioId);
      } else {
        newSet.add(usuarioId);
      }
      return newSet;
    });
  }, []);

  // Componente helper para botones de acción
  const ActionButtons = ({ usuario, showText = false, layout = 'horizontal' }) => {
    const estadoInfo = getEstadoInfo(usuario.estado);
    const isDisabled = !estadoInfo.isActive;
    
    const buttonClass = layout === 'horizontal' ? 'flex space-x-1' : 'flex flex-col space-y-2';
    const buttonSize = showText ? 'px-3 py-2' : 'px-2 py-1';
    const iconSize = showText ? 'h-4 w-4' : 'h-3 w-3';
    const textClass = showText ? 'inline' : 'hidden xl:inline';
    
    return (
      <div className={buttonClass}>
        {layout === 'horizontal' && (
          <button
            onClick={() => toggleRowExpansion(usuario.id)}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-center text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 transition-all duration-200"
            title={expandedRows.has(usuario.id) ? "Ocultar detalles" : "Ver más detalles"}
          >
            <svg className={`h-3 w-3 mr-1 transition-transform duration-200 ${expandedRows.has(usuario.id) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="hidden lg:inline">
              {expandedRows.has(usuario.id) ? 'Ocultar' : 'Ver más'}
            </span>
          </button>
        )}
        <button
          onClick={() => handleEditClick(usuario)}
          className={`${layout === 'vertical' ? 'w-full ' : ''}inline-flex items-center ${buttonSize} text-xs font-medium text-center text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 hover:text-slate-800 focus:ring-2 focus:outline-none focus:ring-slate-300 transition-all duration-200 btn-accion`}
          title="Editar empleado"
        >
          <svg className={`${iconSize} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className={textClass}>{showText ? 'Editar Empleado' : 'Editar'}</span>
        </button>
        <button
          onClick={() => handleDisableClick(usuario)}
          disabled={isDisabled}
          className={`${layout === 'vertical' ? 'w-full ' : ''}inline-flex items-center ${buttonSize} text-xs font-medium text-center text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 hover:text-orange-800 focus:ring-2 focus:outline-none focus:ring-orange-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-50 transition-all duration-200 btn-accion`}
          title="Deshabilitar empleado"
        >
          <svg className={`${iconSize} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className={textClass}>{showText ? 'Deshabilitar Empleado' : 'Deshabilitar'}</span>
        </button>
      </div>
    );
  };

  // Componente helper para tarjetas de usuario
  const UserCard = ({ usuario, isMobile = false }) => {
    const estadoInfo = getEstadoInfo(usuario.estado);
    
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-start mb-2">
          <div className={isMobile ? "flex-1" : ""}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {usuario.nombre} {usuario.apellido}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {usuario.id}</p>
          </div>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isMobile ? 'ml-2 ' : ''}${estadoInfo.className}`}>
            {estadoInfo.text}
          </span>
        </div>
        
        {isMobile ? (
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
              <span className="text-gray-600 dark:text-gray-400">{formatValue(usuario.cedula)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Puesto:</span>
              <span className="text-gray-600 dark:text-gray-400 text-right">{formatValue(usuario.puesto)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Área:</span>
              <span className="text-gray-600 dark:text-gray-400 text-right">{formatValue(usuario.departamento)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Sucursal:</span>
              <span className="text-gray-600 dark:text-gray-400 text-right">{formatValue(usuario.sucursal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700 dark:text-gray-300">Origen:</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {formatValue(usuario.origen)}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
              <p className="text-gray-600 dark:text-gray-400 truncate">{formatValue(usuario.cedula)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Puesto:</span>
              <p className="text-gray-600 dark:text-gray-400 truncate">{formatValue(usuario.puesto)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Área:</span>
              <p className="text-gray-600 dark:text-gray-400 truncate">{formatValue(usuario.departamento)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Sucursal:</span>
              <p className="text-gray-600 dark:text-gray-400 truncate">{formatValue(usuario.sucursal)}</p>
            </div>
            <div className="col-span-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">Origen:</span>
              <span className="inline-flex px-2 py-1 ml-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {formatValue(usuario.origen)}
              </span>
            </div>
          </div>
        )}
        
        <ActionButtons usuario={usuario} showText={isMobile} layout={isMobile ? 'vertical' : 'horizontal'} />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col max-w-[1400px] mx-auto">
      {/* Indicador de filtrado por sucursal */}
      {filterBySucursal && sucursalNombre && (
        <div className="mb-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">
              Mostrando solo empleados de: <span className="font-semibold">{sucursalNombre}</span>
            </span>
            <span className="ml-auto text-xs text-blue-600 dark:text-blue-400">
              {totalItems} empleado{totalItems !== 1 ? 's' : ''} encontrado{totalItems !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Controles de paginación superiores */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-sm text-gray-700 dark:text-gray-300">elementos</span>
        </div>
        
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} resultados
        </div>
      </div>

      {/* Contenedor principal - removido overflow-hidden y h-full */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden lg:block">
          <div className="min-w-full inline-block align-middle">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 tabla-recurso-humano">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-[1]">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-12">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-48">
                    Nombre Completo
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-36">
                    Puesto
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-32">
                    Sucursal
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-24">
                    Estado
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {datosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No hay datos de recursos humanos disponibles
                    </td>
                  </tr>
                ) : (
                  datosPaginados.map((usuario) => (
                    <React.Fragment key={usuario.id}>
                      {/* Fila principal */}
                      <tr key={`main-${usuario.id}`} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {usuario.id}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="font-medium" title={`${usuario.nombre} ${usuario.apellido}`}>
                            {usuario.nombre} {usuario.apellido}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="truncate block" title={usuario.puesto || 'N/A'}>
                            {usuario.puesto || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="truncate block" title={usuario.sucursal || 'N/A'}>
                            {usuario.sucursal || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">
                          <span className={getEstadoInfo(usuario.estado).className}>
                            {getEstadoInfo(usuario.estado).text}
                          </span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">
                          <ActionButtons usuario={usuario} layout="horizontal" />
                        </td>
                      </tr>
                      
                      {/* Fila expandible con detalles completos */}
                      {expandedRows.has(usuario.id) && (
                        <tr key={`expanded-${usuario.id}`} className="bg-gray-50 dark:bg-gray-800 row-expansion">
                          <td colSpan="6" className="px-4 py-4">
                            <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                Información Completa - {usuario.nombre} {usuario.apellido}
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
                                  <p className="text-gray-600 dark:text-gray-400">{formatValue(usuario.cedula)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Área/Departamento:</span>
                                  <p className="text-gray-600 dark:text-gray-400">{formatValue(usuario.departamento)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Origen:</span>
                                  <p className="text-gray-600 dark:text-gray-400">{formatValue(usuario.origen)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Cuenta Bancaria:</span>
                                  <p className="text-gray-600 dark:text-gray-400">{formatValue(usuario.ctaBanco)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">Estado Completo:</span>
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                                    getEstadoInfo(usuario.estado).isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {getEstadoInfo(usuario.estado).fullText}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700 dark:text-gray-300">ID Sistema:</span>
                                  <p className="text-gray-600 dark:text-gray-400">#{usuario.id}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vista de tarjetas para tablets */}
        <div className="hidden md:block lg:hidden">
          {datosPaginados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de recursos humanos disponibles
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 p-3">
              {datosPaginados.map((usuario) => (
                <UserCard key={usuario.id} usuario={usuario} />
              ))}
            </div>
          )}
        </div>

        {/* Vista de tarjetas para móviles */}
        <div className="block md:hidden">
          {datosPaginados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de recursos humanos disponibles
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {datosPaginados.map((usuario) => (
                <UserCard key={usuario.id} usuario={usuario} isMobile={true} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Controles de paginación inferiores */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex-shrink-0">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Página {currentPage} de {totalPages}
          </div>
          
          <div className="flex items-center space-x-1">
            {/* Botón anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            >
              Anterior
            </button>
            
            {/* Números de página */}
            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                  currentPage === page
                    ? 'text-blue-600 bg-blue-50 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-600'
                    : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Botón siguiente */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      <EditUserModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        userData={selectedUser}
      />

      <DisableUserModal
        show={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        onConfirm={handleConfirmDisable}
        userName={selectedUser ? `${selectedUser.nombre} ${selectedUser.apellido}` : ''}
      />
    </div>
  );
};

export default TablaRecursoHumano;
