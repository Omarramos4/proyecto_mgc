import React from 'react';

const CoberturaDetails = ({ cobertura }) => {
  if (!cobertura) return null;
  return (
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
    </div>
  );
};

export default CoberturaDetails;
