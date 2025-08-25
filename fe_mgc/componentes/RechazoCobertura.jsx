import React from 'react';

const RechazoCobertura = ({
  rejectionFile,
  isRejecting,
  rejectionProgress,
  handleFileChange,
  handleRechazarCobertura,
  onBack
}) => (
  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-red-900 dark:text-red-300 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Rechazo de Cobertura
        </h4>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          title="Volver a la selección"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        {/* Archivo de Justificación de Rechazo */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Archivo de Justificación de Rechazo *
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, 'rejection')}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:text-gray-400 dark:file:bg-red-900 dark:file:text-red-300"
              disabled={isRejecting}
            />
            {rejectionFile && (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs">{rejectionFile.name}</span>
              </div>
            )}
          </div>
          {isRejecting && rejectionProgress > 0 && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${rejectionProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Subiendo justificación de rechazo... {rejectionProgress}%</p>
            </div>
          )}
        </div>
        {/* Botón de Rechazar */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleRechazarCobertura}
            disabled={!rejectionFile || isRejecting}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
              rejectionFile && !isRejecting
                ? 'bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isRejecting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Rechazar Cobertura
              </>
            )}
          </button>
        </div>
        {!rejectionFile && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
            * Debe cargar el archivo de justificación para habilitar el rechazo
          </p>
        )}
      </div>
    </div>
  </div>
);

export default RechazoCobertura;
