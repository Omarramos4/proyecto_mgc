import React from 'react';

const FileViewer = ({ archivo, onClose, onDownload, getFileIcon }) => {
  if (!archivo) return null;

  const fileName = archivo.rutaArchivo?.split('/').pop() || archivo.descripcion;
  const extension = fileName?.split('.').pop()?.toLowerCase();
  const fileUrl = `/api/archivo/${archivo.rutaArchivo}`;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getFileIcon(fileName, archivo.tipoArchivo?.descripcion)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {archivo.descripcion}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tipo: {archivo.tipoArchivo?.descripcion || 'No especificado'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              title="Abrir en nueva pestaña"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
            <button
              onClick={() => onDownload(archivo)}
              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              title="Descargar archivo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2V9z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Cerrar visor"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-4 overflow-auto" style={{ height: 'calc(100% - 80px)' }}>
          {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension) ? (
            <div className="h-full flex items-center justify-center">
              <img
                src={fileUrl}
                alt={archivo.descripcion}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">{getFileIcon(fileName, archivo.tipoArchivo?.descripcion)}</span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {archivo.descripcion}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {extension === 'pdf' 
                  ? 'Este archivo PDF se abrirá en una nueva pestaña con el lector predeterminado de tu navegador'
                  : 'Este tipo de archivo se abre mejor en una aplicación externa'
                }
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open(fileUrl, '_blank', 'noopener,noreferrer')}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {extension === 'pdf' ? 'Abrir PDF' : 'Abrir en nueva pestaña'}
                </button>
                <button
                  onClick={() => onDownload(archivo)}
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2-2V9z" />
                  </svg>
                  Descargar Archivo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
