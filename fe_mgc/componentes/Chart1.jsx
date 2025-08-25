'use client';

import { useEffect, useRef } from 'react';
import React from 'react';
import Chart from 'chart.js/auto';

/**
 * Componente de gráfico de barras para mostrar coberturas por área.
 * El gráfico se redimensiona automáticamente cuando el estado de la barra lateral cambia.
 * @param {{isSidebarExpanded: boolean, coberturas: Array}} props
 */
function Chart1Component({ isSidebarExpanded, coberturas = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const processCoberturasByArea = (coberturas) => {
    if (!coberturas || coberturas.length === 0) {
      return {
        labels: ['Sin datos'],
        data: [0],
        backgroundColor: ['#e5e7eb']
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
      data: cantidades,
      backgroundColor: areas.map((_, index) => colores[index % colores.length])
    };
  };

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    if (coberturas && coberturas.length > 0) {
      const chartData = processCoberturasByArea(coberturas);
      const data = {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Coberturas',
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      };
      const config = {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true },
          },
          scales: { y: { beginAtZero: true } },
        },
      };
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, config);
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isSidebarExpanded, coberturas]);

  if (!coberturas || coberturas.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg sm:p-5 max-w-full max-h-120">
        <h3 className="text-xl font-bold leading-none text-gray-700">
          Coberturas por Área
        </h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-gray-500 text-center">
            <div className="text-gray-400 text-4xl mb-2">📊</div>
            <div>No hay datos disponibles</div>
            <div className="text-sm text-gray-400 mt-1">Los datos aparecerán aquí cuando estén disponibles</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-lg sm:p-5 max-w-full max-h-120">
      <h3 className="text-xl font-bold leading-none text-gray-700">
        Coberturas por Área
      </h3>
      <div className="-mt-5 h-full w-full" id="bar-chart">
        <canvas ref={chartRef} id="chart1" className="w-full h-full" />
      </div>
    </div>
  );
}

export default React.memo(Chart1Component);