// utils/coberturasUtils.js

export const getEstadoInfo = (estado) => {
  const estadoLower = estado?.toLowerCase();
  let config = {
    isActive: false,
    className: '',
    text: estado || 'Sin estado',
    fullText: estado || 'Sin estado'
  };

  switch (estadoLower) {
    case 'aprobado':
    case 'activo':
      config = {
        isActive: true,
        className: 'inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        text: 'Aprobado',
        fullText: 'Cobertura Aprobada'
      };
      break;
    case 'pendiente':
      config = {
        isActive: false,
        className: 'inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        text: 'Pendiente',
        fullText: 'Cobertura Pendiente'
      };
      break;
    case 'rechazado':
    case 'denegado':
      config = {
        isActive: false,
        className: 'inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        text: 'Rechazado',
        fullText: 'Cobertura Rechazada'
      };
      break;
    case 'en proceso':
      config = {
        isActive: false,
        className: 'inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        text: 'En Proceso',
        fullText: 'Cobertura En Proceso'
      };
      break;
    default:
      config = {
        isActive: false,
        className: 'inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
        text: estado || 'Sin estado',
        fullText: estado || 'Sin estado'
      };
  }

  return config;
};

export const formatValue = (value) => value || 'N/A';

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};
