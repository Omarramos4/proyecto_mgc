// componentes/ActionButtons.jsx
import React from 'react';
import { getEstadoInfo } from '../utils/coberturasUtils';

const ActionButtons = ({ cobertura, showText = false, layout = 'horizontal', onRevisar, onPagar }) => {
  const buttonClass = layout === 'horizontal' ? 'flex space-x-1' : 'flex flex-col space-y-2';
  const buttonSize = showText ? 'px-3 py-2' : 'px-2 py-1';
  const iconSize = showText ? 'h-4 w-4' : 'h-3 w-3';
  const textClass = showText ? 'inline' : 'hidden xl:inline';
  const estadoInfo = getEstadoInfo(cobertura.Estado);
  const yaPagado = Array.isArray(cobertura.honorarios) && cobertura.honorarios.length > 0;

  return (
    <div className={buttonClass}>
      <button
        onClick={() => onRevisar(cobertura)}
        className={`${layout === 'vertical' ? 'w-full ' : ''}inline-flex items-center ${buttonSize} text-xs font-medium text-center text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-200 transition-all duration-200 btn-accion`}
        title="Revisar cobertura"
        aria-label="Revisar cobertura"
      >
        <svg className={`${iconSize} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span className={textClass}>{showText ? 'Revisar Cobertura' : 'Revisar'}</span>
      </button>
      {estadoInfo.text === 'Aprobado' && !yaPagado && (
        <button
          onClick={() => onPagar(cobertura)}
          className={`${layout === 'vertical' ? 'w-full ' : ''}inline-flex items-center ${buttonSize} text-xs font-medium text-center text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 hover:text-green-800 focus:ring-2 focus:outline-none focus:ring-green-200 transition-all duration-200 btn-accion`}
          title="Pagar cobertura"
          aria-label="Pagar cobertura"
        >
          <svg className={`${iconSize} mr-1`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span className={textClass}>{showText ? 'Pagar Cobertura' : 'Pagar'}</span>
        </button>
      )}
      {estadoInfo.text === 'Aprobado' && yaPagado && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-200 text-green-900 border border-green-400 ml-2">
          <svg className="h-4 w-4 mr-1 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          Pagado
        </span>
      )}
    </div>
  );
};

export default ActionButtons;
