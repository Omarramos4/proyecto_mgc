'use client';
//Estilos
import "../../globals.css";

//Componentes
import Carddetails from '../../../componentes/Carddetails';
import ChartComponent from '../../../componentes/ChartComponent';
import { getCoberturasPorArea, getCoberturasPorSucursal, getHonorariosPorMes } from '../../../utils/chartUtils';
import Header from '../../../componentes/Header';
import FloatingActionButton from '../../../componentes/FloatingActionButton';
import { useSidebar } from '../../context/SidebarContext';
import { useEffect, useState, useMemo} from 'react';
import SucursalSelector from '../../../componentes/SucursalSelector';
import { useSucursalFilterMemo } from '../../hooks/useSucursalFilterMemo';
import { useHonorariosChart } from '../../hooks/useHonorariosChart';
import TablaUltimasCoberturas from '../../../componentes/TablaUltimasCoberturas';

//DATOS
import { useSuspenseQuery } from '@apollo/client';
import { GET_PUESTOS } from '../../graphql/operations/catalogos';
import { GET_COBERTURAS } from '../../graphql/operations/coberturas';

// Prevent static generation since this page uses user-specific filters
export const dynamic = 'force-dynamic';

export default function dashboard() {

  //Obtiene el estado del sidebar
  const { isSidebarExpanded } = useSidebar();
  const [showWelcome, setShowWelcome] = useState(true);

  // Usar useSuspenseQuery para cargar datos en el cliente
  const { data: puestosData } = useSuspenseQuery(GET_PUESTOS);
  const { data: coberturasData } = useSuspenseQuery(GET_COBERTURAS);

  const puestos = useMemo(() => puestosData?.puestos || [], [puestosData]);
  const coberturas = useMemo(() => coberturasData?.coberturas || [], [coberturasData]);

  // Hook para filtrado por sucursal (optimizado)
  const {
    selectedSucursal,
    setSelectedSucursal,
    estadisticas,
    filteredCoberturas
  } = useSucursalFilterMemo(coberturas);

  //estadísticas memoizadas 
  const coberturasRealizadas = estadisticas.realizadas;
  const coberturasRechazadas = estadisticas.rechazadas;
  const coberturasPendientes = estadisticas.pendientes;
  const coberturasAutorizadas = estadisticas.autorizadas;

  // Datos para los charts
  // Chart de Honorarios (line)
  const honorariosChart = useHonorariosChart(selectedSucursal);
  const honorariosData = getHonorariosPorMes(honorariosChart.chartData);
  const honorariosLoading = honorariosChart.loading;
  const honorariosError = honorariosChart.error;
  const honorariosExtra = honorariosChart.chartData && honorariosChart.chartData.totalGeneral ? (
    <>
      <span className="font-semibold">Total General: </span>
      L{honorariosChart.chartData.totalGeneral.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      {honorariosChart.chartData.promedioMensual && (
        <>
          <br/>
          <span className="ml-4 font-semibold">Promedio Mensual: </span>
          L{honorariosChart.chartData.promedioMensual.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </>
      )}
    </>
  ) : null;

  // Chart de Coberturas por Área (bar)
  const coberturasPorAreaData = getCoberturasPorArea(filteredCoberturas);

  // Chart de Coberturas por Sucursal (doughnut)
  const coberturasPorSucursalData = getCoberturasPorSucursal(filteredCoberturas);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col">
      
      <Header title="Dashboard de Coberturas" />
      <div className="bg-gray-100 rounded p-2 mt-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SucursalSelector selectedSucursal={selectedSucursal} setSelectedSucursal={setSelectedSucursal} />
        </div>
      </div>
      <div className="grid grid-cols-1 mt-2 md:grid-cols-4 gap-4">
        <Carddetails
          title="Coberturas Realizadas"
          text={coberturasRealizadas}
          isSidebarExpanded={isSidebarExpanded}
        />
        <Carddetails
          title="Coberturas Pendientes"
          text={coberturasPendientes}
          isSidebarExpanded={isSidebarExpanded}
        />
        <Carddetails
          title="Coberturas Autorizadas"
          text={coberturasAutorizadas}
          isSidebarExpanded={isSidebarExpanded}
        />
        <Carddetails
          title="Coberturas Rechazadas"
          text={coberturasRechazadas}
          isSidebarExpanded={isSidebarExpanded}
        />
      </div>

  <TablaUltimasCoberturas coberturas={coberturas} />

      <div className="grid grid-cols-1 mt-2 md:grid-cols-4 gap-4">
        <ChartComponent
          type="bar"
          data={honorariosData}
          title="Honorarios Netos Totales por Mes"
          loading={honorariosLoading}
          error={honorariosError}
          emptyMessage="No hay datos disponibles"
          extraInfo={honorariosExtra}
        />
        <ChartComponent
          type="bar"
          data={coberturasPorAreaData}
          title="Coberturas por Área"
          loading={false}
          error={null}
          emptyMessage="No hay datos disponibles"
        />
        <ChartComponent
          type="line"
          data={coberturasPorSucursalData}
          title="Coberturas por Mes"
          loading={false}
          error={null}
          emptyMessage="No hay datos disponibles"
        />
        <ChartComponent
          type="doughnut"
          data={coberturasPorSucursalData}
          title="Coberturas por Sucursal"
          loading={false}
          error={null}
          emptyMessage="No hay datos disponibles"
        />
      </div>

      
      <FloatingActionButton />
    </div>
  )
}