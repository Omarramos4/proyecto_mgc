import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartComponent({ type = 'bar', data, options = {}, title = '', loading = false, error = null, emptyMessage = 'No hay datos disponibles', extraInfo = null, height = '20rem', width = '100%' }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (data && data.labels && data.labels.length > 0 && chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  if (loading) {
    return (
      <div className="bg-gray-200 rounded-lg p-5 max-w-full" style={{ minHeight: height }}>
        <h3 className="text-xl font-bold leading-none text-gray-700 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500 flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Cargando datos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-200 rounded-lg p-5 max-w-full" style={{ minHeight: height }}>
        <h3 className="text-xl font-bold leading-none text-gray-700 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-red-500 text-center">
            <div className="text-red-600 text-lg mb-2">⚠️</div>
            <div>Error al cargar los datos</div>
            <div className="text-sm text-gray-600 mt-1">{error.message || error}</div>
          </div>
        </div>
      </div>
    );
  }

    if (!data || !Array.isArray(data.labels) || data.labels.length === 0 || data.labels[0] === undefined || (data.datasets && data.datasets[0] && data.datasets[0].label === 'Sin datos')) {
      return (
        <div className="bg-gray-200 rounded-lg p-5 max-w-full" style={{ minHeight: height }}>
          <h3 className="text-xl font-bold leading-none text-gray-700 mb-4">{title}</h3>
          <div className="flex items-center justify-center h-80">
            <div className="text-gray-500 text-center">
              <div className="text-gray-400 text-4xl mb-2">📊</div>
              <div>{emptyMessage || 'No hay datos disponibles'}</div>
              <div className="text-sm text-gray-400 mt-1">Los datos aparecerán aquí cuando estén disponibles</div>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="bg-gray-200 rounded-lg p-5 max-w-full" style={{ minHeight: height }}>
      <h3 className="text-xl font-bold leading-none text-gray-700 mb-4">{title}</h3>
      <div className="h-full w-full" style={{ height, width }}>
        <canvas ref={chartRef} className="w-full h-full" />
      </div>
      {extraInfo && (
        <div className="mt-4 text-sm text-gray-600">{extraInfo}</div>
      )}
    </div>
  );
}

export default React.memo(ChartComponent);
