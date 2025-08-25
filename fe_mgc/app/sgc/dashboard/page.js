'use client';
//Estilos
import "../../globals.css";

//Componentes
import Carddetails from '../../../componentes/Carddetails';
import Chart1 from '../../../componentes/Chart1';
import Chart2 from '../../../componentes/Chart2';
import Chart3 from '../../../componentes/Chart3';
import Header from '../../../componentes/Header';
import FloatingActionButton from '../../../componentes/FloatingActionButton';
import { useSidebar } from '../../context/SidebarContext';
import { useEffect, useState, useMemo, useCallback } from 'react';
import SucursalSelector from '../../../componentes/SucursalSelector';
import { useSucursalFilterMemo } from '../../hooks/useSucursalFilterMemo';


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

      <div className="grid grid-cols-1 mt-2 md:grid-cols-3 gap-4">
        <Chart2 isSidebarExpanded={isSidebarExpanded} selectedSucursal={selectedSucursal} />
        <Chart1 isSidebarExpanded={isSidebarExpanded} coberturas={filteredCoberturas} />
        <Chart3 isSidebarExpanded={isSidebarExpanded} coberturas={filteredCoberturas} />
      </div>

      
      <FloatingActionButton />
    </div>
  )
}