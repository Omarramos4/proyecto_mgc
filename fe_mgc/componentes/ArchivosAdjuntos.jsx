import React from 'react';

const ArchivosAdjuntos = ({ archivos, getFileIcon, openFileViewer, downloadFile }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        Archivos Adjuntos ({archivos?.length || 0})
      </h4>
      {archivos && archivos.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {archivos.map((archivo) => {
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
  );
};

export default ArchivosAdjuntos;
