'use client';
import React, { useState, useMemo, useCallback } from 'react';
import RevisarCoberturaModal from './RevisarCoberturaModal';
import PagarCoberturaModal from './PagoCoberturaModal';
import { getEstadoInfo, formatDate } from '../utils/coberturasUtils';
import ActionButtons from './ActionButtons';
import CoberturaCard from './CoberturaCard';
import Pagination from './Pagination';

const TablaCoberturas = ({ datos = [], onVerDetalles }) => {
  const [showRevisarModal, setShowRevisarModal] = useState(false);
  const [showPagarModal, setShowPagarModal] = useState(false);
  const [selectedCobertura, setSelectedCobertura] = useState(null);
  
  // Estados para paginación optimizada
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Iniciar con 5 items por página
  
  
  // Calcular datos paginados con useMemo para optimización
  const { totalItems, totalPages, startIndex, endIndex, datosPaginados } = useMemo(() => {
    const total = datos.length;
    const pages = Math.ceil(total / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = datos.slice(start, end);
    
    return {
      totalItems: total,
      totalPages: pages,
      startIndex: start,
      endIndex: end,
      datosPaginados: paginated
    };
  }, [datos, currentPage, itemsPerPage]);
  
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

  // Función para abrir el modal de revisión
  const handleRevisarCobertura = useCallback((cobertura) => {
    setSelectedCobertura(cobertura);
    setShowRevisarModal(true);
    // También ejecutar la función onVerDetalles si existe (para compatibilidad)
    if (onVerDetalles) {
      onVerDetalles(cobertura);
    }
  }, [onVerDetalles]);

  // Función para cerrar el modal de revisión
  const handleCloseRevisarModal = useCallback(() => {
    setShowRevisarModal(false);
    setSelectedCobertura(null);
  }, []);

  // Funciones para el modal de Pagar Cobertura
  const handlePagarCobertura = useCallback((cobertura) => {
    setSelectedCobertura(cobertura);
    setShowPagarModal(true);
  }, []);

  const handleClosePagarModal = useCallback(() => {
    setShowPagarModal(false);
    setSelectedCobertura(null);
  }, []);


  return (
    <div className="w-full flex flex-col max-w-[1400px] mx-auto">
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

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Vista de tabla para pantallas grandes */}
        <div className="hidden lg:block">
          <div className="min-w-full inline-block align-middle">
            <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 tabla-coberturas">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-[1]">
                <tr>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-12">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-40">
                    Cobertura
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-40">
                    Cubierto
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-32">
                    Puesto
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-28">
                    Motivo
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-28">
                    Modalidad
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-32">
                    Fecha Solicitud
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-24">
                    Estado
                  </th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-24">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {datosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No hay datos de coberturas disponibles
                    </td>
                  </tr>
                ) : (
                  datosPaginados.map((cobertura) => (
                    <React.Fragment key={cobertura.id}>
                      {/* Fila principal */}
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {cobertura.id}
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="font-medium" title={cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'}>
                            {cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="font-medium" title={cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}>
                            {cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="truncate block" title={cobertura.puesto?.Descripcion || 'N/A'}>
                            {cobertura.puesto?.Descripcion || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="truncate block" title={cobertura.motivo?.Descripcion || 'N/A'}>
                            {cobertura.motivo?.Descripcion || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 text-sm text-gray-900 dark:text-white">
                          <span className="truncate block" title={cobertura.modalidad?.Descripcion || 'N/A'}>
                            {cobertura.modalidad?.Descripcion || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(cobertura.FechaSolicitud)}
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">
                          <span className={getEstadoInfo(cobertura.Estado).className}>
                            {getEstadoInfo(cobertura.Estado).text}
                          </span>
                        </td>
                        <td className="px-2 py-3 whitespace-nowrap text-sm">
                          <ActionButtons 
                            cobertura={cobertura} 
                            layout="horizontal" 
                            onRevisar={handleRevisarCobertura}
                            onPagar={handlePagarCobertura}
                          />
                        </td>
                      </tr>
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
              No hay datos de coberturas disponibles
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 p-3">
              {datosPaginados.map((cobertura) => (
                <CoberturaCard 
                  key={cobertura.id} 
                  cobertura={cobertura} 
                  onRevisar={handleRevisarCobertura}
                  onPagar={handlePagarCobertura}
                />
              ))}
            </div>
          )}
        </div>

        {/* Vista de tarjetas para móviles */}
        <div className="block md:hidden">
          {datosPaginados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay datos de coberturas disponibles
            </div>
          ) : (
            <div className="space-y-4 p-4">
              {datosPaginados.map((cobertura) => (
                <CoberturaCard 
                  key={cobertura.id} 
                  cobertura={cobertura} 
                  isMobile={true}
                  onRevisar={handleRevisarCobertura}
                  onPagar={handlePagarCobertura}
                />
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      {/* Modal de revisión de cobertura */}
      {showRevisarModal && (
        <RevisarCoberturaModal 
          show={showRevisarModal}
          onClose={handleCloseRevisarModal}
          coberturaId={selectedCobertura?.id}
        />
      )}

      {/* Modal de Pagar Cobertura */}
      {showPagarModal && (
        <PagarCoberturaModal
            show={showPagarModal}
            onClose={handleClosePagarModal}
            cobertura={selectedCobertura}
        />
      )}
    </div>
  );
};

export default TablaCoberturas;
