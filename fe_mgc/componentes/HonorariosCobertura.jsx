import React from 'react';

const HonorariosCobertura = ({ honorario, formatDate }) => {
  if (!honorario) return null;
  return (
    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-300 dark:border-green-700">
      <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Honorarios Registrados
      </h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">ISR:</span>
          <p className="text-gray-600 dark:text-gray-400">{typeof honorario.ISR === 'number' ? `L ${honorario.ISR.toFixed(2)}` : 'No disponible'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">ISS:</span>
          <p className="text-gray-600 dark:text-gray-400">{typeof honorario.ISS === 'number' ? `L ${honorario.ISS.toFixed(2)}` : 'No disponible'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Reloj Marcador:</span>
          <p className="text-gray-600 dark:text-gray-400">{typeof honorario.RelojMarcador === 'number' ? `L ${honorario.RelojMarcador.toFixed(2)}` : 'No disponible'}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">Total Deducción:</span>
          <p className="text-gray-600 dark:text-gray-400">{typeof honorario.totalDeduccion === 'number' ? `L ${honorario.totalDeduccion.toFixed(2)}` : 'No disponible'}</p>
        </div>
        <div className="col-span-2">
          <span className="font-bold text-green-700 dark:text-green-300">Pago Neto:</span>
          <p className="text-lg font-bold text-green-800 dark:text-green-200">{typeof honorario.pagoNeto === 'number' ? `L ${honorario.pagoNeto.toFixed(2)}` : 'No disponible'}</p>
        </div>
        <div className="col-span-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Registro:</span>
          <p className="text-gray-600 dark:text-gray-400">{formatDate(honorario.fechaHora_honorario)}</p>
        </div>
      </div>
    </div>
  );
};

export default HonorariosCobertura;
