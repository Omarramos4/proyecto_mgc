'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '../context/UserContext';
import { useCoberturaDetails } from '../app/hooks/useCoberturaDetails';
import { useCoberturaActions } from '../app/hooks/useCoberturaActions';
import { useFileViewer } from '../app/hooks/useFileViewer';
import { useRevisionFiles } from '../app/hooks/useRevisionFiles';

import Notification from './Notification';
import FileViewer from './FileViewer';
import AprobacionCobertura from './AprobacionCobertura';
import RechazoCobertura from './RechazoCobertura';
import HonorariosCobertura from './HonorariosCobertura';



const RevisarCoberturaModal = ({ show, onClose, coberturaId }) => {
  // Hook para obtener el usuario autenticado
  const { user } = useUser();
  
    // Hook para visor de archivos
    const {
      selectedFile,
      showFileViewer,
      openFileViewer,
      closeFileViewer
    } = useFileViewer();
  const [expandedSections, setExpandedSections] = useState({
    solicitante: false,
    fechasEstado: false,
    empleadoCobertura: false,
    empleadoCubierto: false
  });
  
  // Estados para los archivos de revisión
  
  // Estados para el rechazo de cobertura
    // Hook para gestión de archivos de revisión
    const {
      directorFile,
      setDirectorFile,
      hrFile,
      setHrFile,
      rejectionFile,
      setRejectionFile,
      handleFileChange
    } = useRevisionFiles();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ director: 0, hr: 0 });
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectionProgress, setRejectionProgress] = useState(0);
    
  // Estado para la selección de acción (aprobar/rechazar)
  const [selectedAction, setSelectedAction] = useState(null); // 'aprobar', 'rechazar', null
  
  // Estado para el portal
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Limpiar notificación cuando se cierre el modal
  useEffect(() => {
    if (!show) {
      setNotification(null);
      setNotificationVisible(false);
      setSelectedAction(null); // Restablecer la selección al cerrar el modal
    }
  }, [show]);

  // Hook de datos
  const { cobertura, loading, error } = useCoberturaDetails(coberturaId, show);

  // Hook de acciones
  const {
    notification,
    notificationVisible,
    showNotification,
    closeNotification,
    aprobarCobertura,
    rechazarCobertura
  } = useCoberturaActions(coberturaId, user, onClose);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }, []);

  const getFileIcon = useCallback((fileName, tipoArchivo) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const tipo = tipoArchivo?.toLowerCase();
    if (tipo?.includes('imagen') || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️';
    } else if (tipo?.includes('pdf') || extension === 'pdf') {
      return '📄';
    } else if (tipo?.includes('documento') || ['doc', 'docx'].includes(extension)) {
      return '📝';
    } else if (tipo?.includes('hoja') || ['xls', 'xlsx'].includes(extension)) {
      return '📊';
    } else {
      return '📎';
    }
  }, []);


  const downloadFile = useCallback((archivo) => {
    const fileUrl = `/api/archivo/${archivo.rutaArchivo}`;
    const fileName = archivo.rutaArchivo?.split('/').pop() || archivo.descripcion;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);


  const toggleSection = useCallback((sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }, []);


  // Refactor: usar hooks para aprobar/rechazar cobertura
  const handleAprobarCobertura = useCallback(async () => {
    setIsUploading(true);
    await aprobarCobertura(
      directorFile,
      hrFile,
      setUploadProgress,
      setDirectorFile,
      setHrFile,
      () => {
        setTimeout(() => {
          onClose();
          setTimeout(() => window.location.reload(), 1000);
        }, 3500);
      }
    );
    setIsUploading(false);
  }, [directorFile, hrFile, aprobarCobertura, setUploadProgress, setDirectorFile, setHrFile, onClose]);

  const handleRechazarCobertura = useCallback(async () => {
    setIsRejecting(true);
    await rechazarCobertura(
      rejectionFile,
      setRejectionProgress,
      setRejectionFile,
      () => {
        setTimeout(() => {
          onClose();
          setTimeout(() => window.location.reload(), 1000);
        }, 3500);
      }
    );
    setIsRejecting(false);
  }, [rejectionFile, rechazarCobertura, setRejectionProgress, setRejectionFile, onClose]);


  const getEstadoBadge = useCallback((estado) => {
    const estadoLower = estado?.toLowerCase();
    let badgeClass = '';
    switch (estadoLower) {
      case 'aprobado':
      case 'activo':
        badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
      case 'pendiente':
        badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        break;
      case 'rechazado':
      case 'denegado':
        badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        break;
      case 'en proceso':
        badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
    return `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`;
  }, []);


  if (!show || !mounted) {
    return null;
  }

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-900 dark:text-white">Cargando detalles de la cobertura...</span>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  if (error || !cobertura) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Error al cargar los datos
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No se pudieron cargar los detalles de la cobertura.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  const modalContent = (
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pt-8 pb-8">
        <div className="relative w-full max-w-6xl max-h-[calc(100vh-4rem)] bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col">
          {/* Header fijo */}
          <div className="flex items-start justify-between p-6 border-b rounded-t dark:border-gray-600 bg-white dark:bg-gray-700 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Revisión de Cobertura {cobertura.id}
              </h3>
              <span className={getEstadoBadge(cobertura.Estado)}>
                {cobertura.Estado}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white transition-all duration-200"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          
          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Detalles de la cobertura y Archivos adjuntos - Principales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Detalles de la cobertura */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Detalles de la Cobertura
                </h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Puesto a Cubrir:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cobertura.puesto?.Descripcion || 'N/A'}
                      {cobertura.puesto?.area?.NombreArea && (
                        <span className="block text-xs text-gray-500">{cobertura.puesto.area.NombreArea}</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Motivo:</span>
                    <p className="text-gray-600 dark:text-gray-400">{cobertura.motivo?.Descripcion || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Modalidad:</span>
                    <p className="text-gray-600 dark:text-gray-400">{cobertura.modalidad?.Descripcion || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Justificación:</span>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 p-3 bg-white dark:bg-gray-700 rounded border">
                      {cobertura.Justificacion || 'Sin justificación proporcionada'}
                    </p>
                  </div>
                </div>
                {/* Honorarios - solo si la cobertura está finalizada/aprobada y existe honorario */}
                {(cobertura.Estado?.toLowerCase() === 'aprobado' || cobertura.Estado?.toLowerCase() === 'finalizada') && Array.isArray(cobertura.honorarios) && cobertura.honorarios.length === 1 && (
                  <HonorariosCobertura honorario={cobertura.honorarios[0]} formatDate={formatDate} />
                )}
              </div>

              {/* Archivos adjuntos */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Archivos Adjuntos ({cobertura.archivos?.length || 0})
                </h4>
                
                {cobertura.archivos && cobertura.archivos.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {cobertura.archivos.map((archivo) => {
                      const fileName = archivo.rutaArchivo?.split('/').pop() || archivo.descripcion;
                      const extension = fileName?.split('.').pop()?.toLowerCase();
                      const isPdf = extension === 'pdf';
                      
                      return (
                        <div
                          key={archivo.id}
                          className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl flex-shrink-0">
                              {getFileIcon(archivo.rutaArchivo, archivo.tipoArchivo?.descripcion)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {archivo.descripcion}
                              </h5>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {archivo.tipoArchivo?.descripcion || 'Tipo no especificado'}
                              </p>
                              <div className="flex items-center mt-3 space-x-2">
                                {isPdf ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        const fileUrl = `/api/archivo/${archivo.rutaArchivo}`;
                                        window.open(fileUrl, '_blank', 'noopener,noreferrer');
                                      }}
                                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                      Abrir PDF
                                    </button>
                                    <button
                                      onClick={() => downloadFile(archivo)}
                                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2V9z" />
                                      </svg>
                                      Descargar
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => openFileViewer(archivo)}
                                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                      Ver archivo
                                    </button>
                                    <button
                                      onClick={() => downloadFile(archivo)}
                                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                                    >
                                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2V9z" />
                                      </svg>
                                      Descargar
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p>No hay archivos adjuntos para esta cobertura</p>
                  </div>
                )}
              </div>
            </div>

            {/* Secciones colapsables */}
            <div className="space-y-4">
              {/* Solicitante - Colapsable */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => toggleSection('solicitante')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Solicitante</h4>
                  </div>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.solicitante ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.solicitante && (
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.solicitante?.NombreCompleto || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.solicitante?.CorreoElectronico || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Sucursal:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.solicitante?.sucursales?.NombreSucursal || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Fechas y Estado - Colapsable */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => toggleSection('fechasEstado')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Fechas y Estado</h4>
                  </div>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSections.fechasEstado ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.fechasEstado && (
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Solicitud:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(cobertura.FechaSolicitud)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Inicio:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(cobertura.FechaInicio)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Fin:</span>
                      <p className="text-gray-600 dark:text-gray-400">{formatDate(cobertura.FechaFin)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Estado Actual:</span>
                      <span className={`ml-2 ${getEstadoBadge(cobertura.Estado)}`}>
                        {cobertura.Estado}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Empleado que realiza la cobertura - Colapsable */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <button
                  onClick={() => toggleSection('empleadoCobertura')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300">Empleado que Realiza la Cobertura</h4>
                  </div>
                  <svg className={`w-5 h-5 text-blue-600 transition-transform ${expandedSections.empleadoCobertura ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.empleadoCobertura && (
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.cobertura?.DNI || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Puesto Actual:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cobertura.cobertura?.puesto?.Descripcion || 'N/A'}
                        {cobertura.cobertura?.puesto?.area?.NombreArea && (
                          <span className="text-xs text-gray-500"> - {cobertura.cobertura.puesto.area.NombreArea}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Sucursal:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.cobertura?.sucursal?.NombreSucursal || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Empleado cubierto - Colapsable */}
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <button
                  onClick={() => toggleSection('empleadoCubierto')}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4 className="text-lg font-semibold text-orange-900 dark:text-orange-300">Empleado Cubierto</h4>
                  </div>
                  <svg className={`w-5 h-5 text-orange-600 transition-transform ${expandedSections.empleadoCubierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedSections.empleadoCubierto && (
                  <div className="px-4 pb-4 space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">DNI:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.cubierto?.DNI || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Puesto:</span>
                      <p className="text-gray-600 dark:text-gray-400">
                        {cobertura.cubierto?.puesto?.Descripcion || 'N/A'}
                        {cobertura.cubierto?.puesto?.area?.NombreArea && (
                          <span className="text-xs text-gray-500"> - {cobertura.cubierto.puesto.area.NombreArea}</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Sucursal:</span>
                      <p className="text-gray-600 dark:text-gray-400">{cobertura.cubierto?.sucursal?.NombreSucursal || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Selector de Acción - Solo visible si el estado no es "Aprobado" ni "Rechazado" */}
              {cobertura.Estado?.toLowerCase() !== 'aprobado' && cobertura.Estado?.toLowerCase() !== 'rechazado' && !selectedAction && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Seleccione una acción para esta cobertura
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      ¿Qué acción desea realizar con esta solicitud de cobertura?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Botón Aprobar */}
                      <button
                        onClick={() => setSelectedAction('aprobar')}
                        className="flex items-center justify-center p-6 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg border border-green-300 dark:border-green-700 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-lg font-semibold text-green-800 dark:text-green-300">Aprobar Cobertura</span>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Aprobar la solicitud con documentos de revisión
                          </p>
                        </div>
                      </button>
                      {/* Botón Rechazar */}
                      <button
                        onClick={() => setSelectedAction('rechazar')}
                        className="flex items-center justify-center p-6 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg border border-red-300 dark:border-red-700 transition-all duration-200 group"
                      >
                        <div className="text-center">
                          <svg className="w-8 h-8 mx-auto mb-2 text-red-600 group-hover:text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-lg font-semibold text-red-800 dark:text-red-300">Rechazar Cobertura</span>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Rechazar la solicitud con justificación
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Sección de Aprobación - Solo visible si se seleccionó "aprobar" */}
              {selectedAction === 'aprobar' && (
                <AprobacionCobertura
                  directorFile={directorFile}
                  hrFile={hrFile}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  handleFileChange={handleFileChange}
                  handleAprobarCobertura={handleAprobarCobertura}
                  onBack={() => setSelectedAction(null)}
                />
              )}

              {/* Sección de Rechazo - Solo visible si se seleccionó "rechazar" */}
              {selectedAction === 'rechazar' && (
                <RechazoCobertura
                  rejectionFile={rejectionFile}
                  isRejecting={isRejecting}
                  rejectionProgress={rejectionProgress}
                  handleFileChange={handleFileChange}
                  handleRechazarCobertura={handleRechazarCobertura}
                  onBack={() => setSelectedAction(null)}
                />
              )}
            </div>
          </div>
          
          {/* Footer fijo */}
          <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Visor de archivos */}
      {showFileViewer && (
        <FileViewer
          archivo={selectedFile}
          onClose={closeFileViewer}
          onDownload={downloadFile}
          getFileIcon={getFileIcon}
        />
      )}
    </>
  );

  return (
    <>
      {show && createPortal(modalContent, document.body)}
      {/* Notificación modularizada */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          visible={notificationVisible}
          onClose={closeNotification}
        />
      )}
    </>
  );
};

export default RevisarCoberturaModal;