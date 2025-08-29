// Funciones utilitarias para procesar datos de los charts
// Coberturas realizadas por mes (para chart tipo line)
export function getCoberturasPorMes(coberturas) {
  if (!coberturas || coberturas.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{ label: 'Sin datos', data: [0], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)' }],
    };
  }
  // Agrupar por mes
  const agrupadoPorMes = {};
  coberturas.forEach(cobertura => {
    const fecha = cobertura.FechaSolicitud || cobertura.fechaSolicitud;
    if (!fecha) return;
    const dateObj = new Date(fecha);
    const mes = dateObj.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
    agrupadoPorMes[mes] = (agrupadoPorMes[mes] || 0) + 1;
  });
  const meses = Object.keys(agrupadoPorMes);
  const cantidades = meses.map(m => agrupadoPorMes[m]);
  return {
    labels: meses,
    datasets: [{
      label: '',
      data: cantidades,
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }],
  };
}

// Coberturas por Área
export function getCoberturasPorArea(coberturas) {
  if (!coberturas || coberturas.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{ label: 'Sin datos', data: [0], backgroundColor: ['#e5e7eb'] }],
    };
  }
  const coberturasPorArea = {};
  coberturas.forEach(cobertura => {
    const area = cobertura?.puesto?.area?.NombreArea || 'Sin Área';
    coberturasPorArea[area] = (coberturasPorArea[area] || 0) + 1;
  });
  const areas = Object.keys(coberturasPorArea);
  const cantidades = areas.map(area => coberturasPorArea[area]);
  const colores = [
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f97316', '#ef4444', '#22c55e',
  ];
  return {
    labels: areas,
    datasets: [{
      label: 'Coberturas',
      data: cantidades,
      backgroundColor: areas.map((_, i) => colores[i % colores.length]),
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };
}

// Coberturas por Sucursal
export function getCoberturasPorSucursal(coberturas) {
  if (!coberturas || coberturas.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{ label: 'Sin datos', data: [0], backgroundColor: ['#e5e7eb'] }],
    };
  }
  const coberturasPorSucursal = {};
  coberturas.forEach(cobertura => {
    const sucursalId = cobertura?.cobertura?.ID_Sucursal?.toString() || cobertura?.cobertura?.sucursal?.id?.toString();
    const sucursalNombre = cobertura?.cobertura?.sucursal?.NombreSucursal || `Sucursal ${sucursalId}`;
    if (sucursalId) {
      coberturasPorSucursal[sucursalNombre] = (coberturasPorSucursal[sucursalNombre] || 0) + 1;
    }
  });
  const sucursales = Object.keys(coberturasPorSucursal);
  const cantidades = sucursales.map(s => coberturasPorSucursal[s]);
  const colores = [
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f97316',
  ];
  return {
    labels: sucursales,
    datasets: [{
      data: cantidades,
      backgroundColor: sucursales.map((_, i) => colores[i % colores.length]),
      borderColor: '#fff',
      borderWidth: 1,
    }],
  };
}

// Honorarios por Mes (requiere datos del hook personalizado)
export function getHonorariosPorMes(chartData) {
  if (!chartData || !chartData.labels || !chartData.data) {
    return {
      labels: ['Sin datos'],
      datasets: [{ label: 'Sin datos', data: [0], borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }],
    };
  }
  return {
    labels: chartData.labels,
    datasets: [{
      label: 'Pagos Netos Totales',
      data: chartData.data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 8,
      pointHoverRadius: 10,
    }],
  };
}
