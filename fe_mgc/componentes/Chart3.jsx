import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';


const Chart3 = React.memo(function Chart3({ isSidebarExpanded, coberturas = [] }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Función para procesar los datos de coberturas por sucursal
  const processCoberturasBySucursal = (coberturas) => {
    if (!coberturas || coberturas.length === 0) {
      return {
        labels: ['Sin datos'],
        data: [0],
        backgroundColor: ['#e5e7eb']
      };
    }

    // Las coberturas ya vienen filtradas desde el componente padre
    // Agrupar por sucursal
    const coberturasPorSucursal = {};
    
    coberturas.forEach(cobertura => {
      const sucursalId = cobertura?.cobertura?.ID_Sucursal?.toString() || 
                        cobertura?.cobertura?.sucursal?.id?.toString();
      const sucursalNombre = cobertura?.cobertura?.sucursal?.NombreSucursal || 
                            `Sucursal ${sucursalId}`;
      
      if (sucursalId) {
        coberturasPorSucursal[sucursalNombre] = (coberturasPorSucursal[sucursalNombre] || 0) + 1;
      }
    });

    // Convertir a arrays para el gráfico
    const sucursales = Object.keys(coberturasPorSucursal);
    const cantidades = sucursales.map(sucursal => coberturasPorSucursal[sucursal]);

    // Si no hay datos, mostrar vacío
    if (sucursales.length === 0) {
      return {
        labels: ['Sin datos'],
        data: [0],
        backgroundColor: ['#e5e7eb']
      };
    }

    // Colores para el gráfico tipo donut
    const colores = [
      '#06b6d4', // cyan-500
      '#0ea5e9', // sky-500
      '#3b82f6', // blue-500
      '#6366f1', // indigo-500
      '#8b5cf6', // violet-500
      '#a855f7', // purple-500
      '#d946ef', // fuchsia-500
      '#f97316', // orange-500
    ];

    return {
      labels: sucursales,
      data: cantidades,
      backgroundColor: sucursales.map((_, index) => colores[index % colores.length])
    };
  };

  useEffect(() => {
    // Destruye el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Solo crear el gráfico si hay datos válidos
    if (coberturas && coberturas.length > 0) {
      // Procesar datos reales de coberturas
      const chartData = processCoberturasBySucursal(coberturas);

      // Datos para el gráfico
      const data = {
          labels: chartData.labels,
          datasets: [
          {
            data: chartData.data,
            backgroundColor: chartData.backgroundColor,
            borderColor: '#fff',
            borderWidth: 1,
          },
        ],
      };

      const config = {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          maintainAspectRatio: false,
        },
      };

      if (chartRef.current) {
        chartInstance.current = new Chart(chartRef.current, config);
      }
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [isSidebarExpanded, coberturas]);

  // Mostrar mensaje cuando no hay datos
  if (!coberturas || coberturas.length === 0) {
    return (
      <div className=" bg-gray-200 rounded-lg sm:p-5 max-w-full max-h-120">
        <h3 className="text-xl font-bold leading-none text-gray-700">
          Coberturas por Sucursal
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
    <div className=" bg-gray-200 rounded-lg sm:p-5 max-w-full max-h-120">
      <h3 className="text-xl font-bold leading-none text-gray-700">
        Coberturas por Sucursal
      </h3>
      <div className="-mt-5 h-full w-full" id="bar-chart">
        <canvas ref={chartRef} className="w-full h-full" />
      </div>
    </div>
  );
});

export default Chart3;