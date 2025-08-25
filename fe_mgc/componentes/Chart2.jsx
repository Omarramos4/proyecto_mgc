
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { useHonorariosChart } from '../app/hooks/useHonorariosChart';


const Chart2 = React.memo(function Chart2({ isSidebarExpanded }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Usar el hook personalizado para obtener los datos
  const { chartData, loading, error } = useHonorariosChart();

  // Efecto para crear/actualizar el gráfico
  useEffect(() => {
    // Destruye el gráfico anterior si existe
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Solo crear el gráfico si hay datos
    if (chartData && chartData.labels && chartData.data && chartRef.current) {
      const config = {
        type: 'line',
        data: {
          labels: chartData.labels,
          datasets: [
            {
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
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 14,
                  weight: 'bold',
                },
                color: '#374151',
                padding: 20,
              },
            },
            title: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#3b82f6',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: $${context.parsed.y.toLocaleString('es-ES', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'rgba(156, 163, 175, 0.2)',
                lineWidth: 1,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12,
                },
                maxRotation: 45,
                minRotation: 0,
              },
              border: {
                color: '#d1d5db',
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(156, 163, 175, 0.3)',
                lineWidth: 1,
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 12,
                },
                callback: function(value) {
                  return '$' + value.toLocaleString('es-ES');
                },
                // Asegurar que haya suficientes divisiones en Y
                stepSize: chartData.data.length === 1 ? Math.max(chartData.data[0] / 5, 1000) : undefined
              },
              border: {
                color: '#d1d5db',
              }
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
          animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
          },
          elements: {
            line: {
              borderWidth: 3,
            },
            point: {
              hoverBorderWidth: 3,
            }
          }
        },
      };

      chartInstance.current = new Chart(chartRef.current, config);
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, isSidebarExpanded]);

  // Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-full">
        <h3 className="text-xl font-bold leading-none text-gray-800 mb-4">
          Honorarios Netos Totales por Mes
        </h3>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-full">
        <h3 className="text-xl font-bold leading-none text-gray-800 mb-4">
          Honorarios Netos Totales por Mes
        </h3>
        <div className="flex items-center justify-center h-80">
          <div className="text-red-500 text-center">
            <div className="text-red-600 text-lg mb-2">⚠️</div>
            <div>Error al cargar los datos</div>
            <div className="text-sm text-gray-600 mt-1">{error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!chartData || !chartData.labels || chartData.labels.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-full">
        <h3 className="text-xl font-bold leading-none text-gray-800 mb-4">
          Honorarios Netos Totales por Mes
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-full">
      <h3 className="text-xl font-bold leading-none text-gray-800 mb-4">
        Honorarios Netos Totales por Mes
      </h3>
      <div className="h-80 w-full" id="line-chart">
        <canvas ref={chartRef} className="w-full h-full" />
      </div>
      {chartData && chartData.totalGeneral && (
        <div className="mt-4 text-sm text-gray-600">
          <span className="font-semibold">Total General: </span>
          ${chartData.totalGeneral.toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
          {chartData.promedioMensual && (
            <>
              <span className="ml-4 font-semibold">Promedio Mensual: </span>
              ${chartData.promedioMensual.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default Chart2;