// componentes/CoberturaCard.jsx
import React from 'react';
import { getEstadoInfo, formatDate } from '../utils/coberturasUtils';
import ActionButtons from './ActionButtons';

const CoberturaCard = ({ cobertura, isMobile = false, onRevisar, onPagar }) => {
  const estadoInfo = getEstadoInfo(cobertura.Estado);

  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-start mb-2">
        <div className={isMobile ? "flex-1" : ""}>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            Cobertura #{cobertura.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {cobertura.cobertura ? `${cobertura.cobertura.Nombres} ${cobertura.cobertura.Apellidos}` : 'N/A'} →{' '}
            {cobertura.cubierto ? `${cobertura.cubierto.Nombres} ${cobertura.cubierto.Apellidos}` : 'N/A'}
          </p>
        </div>
        <span className={estadoInfo.className}>
          {estadoInfo.text}
        </span>
      </div>

      <div className="space-y-1 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Puesto:</span>
          <span className="text-gray-900 dark:text-white truncate ml-2">
            {cobertura.puesto?.Descripcion || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Motivo:</span>
          <span className="text-gray-900 dark:text-white truncate ml-2">
            {cobertura.motivo?.Descripcion || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Modalidad:</span>
          <span className="text-gray-900 dark:text-white truncate ml-2">
            {cobertura.modalidad?.Descripcion || 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Fecha Solicitud:</span>
          <span className="text-gray-900 dark:text-white">
            {formatDate(cobertura.FechaSolicitud)}
          </span>
        </div>
      </div>

      <ActionButtons cobertura={cobertura} showText={isMobile} layout={isMobile ? 'vertical' : 'horizontal'} onRevisar={onRevisar} onPagar={onPagar} />
    </div>
  );
};

export default CoberturaCard;
