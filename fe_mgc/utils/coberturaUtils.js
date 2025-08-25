// Utilidades para cobertura
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};

export const getEstadoBadge = (estado) => {
  const estadoLower = estado?.toLowerCase();
  let badgeClass = '';
  switch (estadoLower) {
    case 'aprobado': badgeClass = 'bg-green-100 text-green-800'; break;
    case 'rechazado': badgeClass = 'bg-red-100 text-red-800'; break;
    case 'pendiente': badgeClass = 'bg-yellow-100 text-yellow-800'; break;
    default: badgeClass = 'bg-gray-100 text-gray-800';
  }
  return `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`;
};
