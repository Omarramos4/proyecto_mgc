'use client';
//Estilos
import "../../globals.css";

//Componentes
import Header from '../../../componentes/Header';
import TablaRecursoHumano from '../../../componentes/TablaRecursoHumano';
import AddUserModal from '../../../componentes/AddRHModal';
import { useNotification } from '../../../componentes/Notification';
import { useState, useEffect, useMemo } from 'react';

//DATOS
import { useSuspenseQuery, useMutation } from '@apollo/client';
import { GET_RECURSOS_HUMANOS } from '../../graphql/operations/recursosHumanos';
import { UPDATE_RECURSO_HUMANO, CREATE_RECURSO_HUMANO } from '../../graphql/operations/recursosHumanos';

// Hooks para datos de usuario
import { useUserSucursal } from '../../../lib/user-hooks';

// Prevent static generation since this page uses GraphQL queries
export const dynamic = 'force-dynamic';

export default function RecursoHumano() {
  // Hook para notificaciones
  const { showNotification, NotificationComponent } = useNotification();
  
  // Hook para obtener sucursal del usuario
  const { sucursalId } = useUserSucursal();

  // Obtener datos de GraphQL
  const { data: recursosData, refetch } = useSuspenseQuery(GET_RECURSOS_HUMANOS);
  
  // Mutación para actualizar recurso humano
  const [updateRecursoHumano] = useMutation(UPDATE_RECURSO_HUMANO, {
    refetchQueries: [{ query: GET_RECURSOS_HUMANOS }],
  });
  
  // Mutación para crear recurso humano
  const [createRecursoHumano] = useMutation(CREATE_RECURSO_HUMANO, {
    refetchQueries: [{ query: GET_RECURSOS_HUMANOS }],
  });
  
  // Transformar y filtrar datos usando useMemo para evitar re-renderizados infinitos
  const empleadosFromAPI = useMemo(() => {
    // Filtrar recursos humanos por sucursal del usuario
    const recursosHumanosFiltrados = (recursosData?.recursosHumanos || []).filter(recurso => {
      const recursoSucursalId = recurso?.sucursal?.id?.toString() || recurso?.ID_Sucursal?.toString();
      return recursoSucursalId === sucursalId?.toString();
    });
    
    const transformedData = recursosHumanosFiltrados?.map(recurso => ({
      id: recurso.id,
      nombre: recurso.Nombres,
      apellido: recurso.Apellidos,
      cedula: recurso.DNI,
      puesto: recurso.puesto?.Descripcion || 'N/A',
      departamento: recurso.puesto?.area?.NombreArea || 'N/A',
      estado: recurso.Estado !== undefined ? recurso.Estado : '1',
      sucursal: recurso.sucursal?.NombreSucursal || 'N/A',
      origen: recurso.Origen || 'N/A',
      ctaBanco: recurso.CtaBanco || 'N/A'
    })) || [];
    
    return transformedData;
  }, [recursosData, sucursalId]);

  const [empleados, setEmpleados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Actualizar empleados cuando cambien los datos de la API
  useEffect(() => {
    if (isClient) {
      setEmpleados(empleadosFromAPI);
    }
  }, [isClient, empleadosFromAPI]);

  // Filtrar empleados basado en el término de búsqueda
  const empleadosFiltrados = empleados.filter(empleado => {
    const searchLower = searchTerm.toLowerCase();
    return (
      empleado.nombre?.toLowerCase().includes(searchLower) ||
      empleado.apellido?.toLowerCase().includes(searchLower) ||
      empleado.cedula?.toLowerCase().includes(searchLower) ||
      empleado.puesto?.toLowerCase().includes(searchLower) ||
      empleado.departamento?.toLowerCase().includes(searchLower) ||
      empleado.sucursal?.toLowerCase().includes(searchLower) ||
      empleado.origen?.toLowerCase().includes(searchLower)
    );
  });

  // Contar empleados activos e inactivos basado en estado numérico
  const empleadosActivos = empleadosFiltrados.filter(emp => emp.estado === 1 || emp.estado === '1').length;
  const empleadosInactivos = empleadosFiltrados.filter(emp => emp.estado === 0 || emp.estado === '0').length;

  // Función para manejar la edición de empleados
  const handleEditarEmpleado = async (empleadoEditado) => {
    try {
      const variables = {
        id: empleadoEditado.id,
        input: {
          Nombres: empleadoEditado.nombre,
          Apellidos: empleadoEditado.apellido,
          DNI: empleadoEditado.cedula,
          CtaBanco: empleadoEditado.ctaBanco,
          Origen: empleadoEditado.origen,
          Estado: String(empleadoEditado.estado), // Convertir a string
        }
      };

      await updateRecursoHumano({ variables });
      
      // Actualizar estado local para feedback inmediato
      setEmpleados(prevEmpleados => 
        prevEmpleados.map(emp => 
          emp.id === empleadoEditado.id ? empleadoEditado : emp
        )
      );
      
    } catch (error) {
      // TODO: Implementar manejo de errores apropiado para producción
    }
  };

  // Función para manejar la deshabilitación de empleados
  const handleDeshabilitarEmpleado = async (empleado) => {
    try {
      const variables = {
        id: empleado.id,
        input: {
          Estado: "0" // Enviar como string
        }
      };

      await updateRecursoHumano({ variables });
      
      // Actualizar estado local para feedback inmediato
      setEmpleados(prevEmpleados => 
        prevEmpleados.map(emp => 
          emp.id === empleado.id ? { ...emp, estado: "0" } : emp
        )
      );
      
    } catch (error) {
      // TODO: Implementar manejo de errores apropiado para producción
    }
  };

  // Función para agregar nuevo empleado
  const handleAgregarEmpleado = () => {
    setShowAddModal(true);
  };

  // Función para guardar nuevo empleado
  const handleSaveNewEmployee = async (newEmployeeData) => {
    try {
      const { data } = await createRecursoHumano({
        variables: {
          input: newEmployeeData
        }
      });
      setShowAddModal(false);
      // Mostrar notificación de éxito
      showNotification('Empleado agregado exitosamente', 'success', {
        title: '¡Empleado Agregado!',
        details: 'El nuevo empleado se ha registrado correctamente en el sistema'
      });
      // Los datos se actualizarán automáticamente gracias a refetchQueries
      return Promise.resolve(data);
    } catch (error) {
  // ...existing code...
      // Mostrar notificación de error
      showNotification('Error al agregar empleado. Verifique los datos e inténtelo nuevamente.', 'error', {
        title: '¡Error al Agregar Empleado!',
        details: 'Verifique que todos los datos estén correctos e inténtelo nuevamente'
      });
      // Re-lanzar el error para que el modal pueda manejarlo
      throw error;
    }
  };


  return (
 <>
    {/* Componente de notificación */}
    <NotificationComponent />
    
    <div className="w-full flex flex-col min-h-screen max-w-screen-2xl mx-auto">
      <Header title="Gestión de Recurso Humano" />
      <div className="flex-1 p-3 lg:p-4 relative z-[1] flex flex-col contenedor-recursos-humanos">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 mb-4 relative z-[2] flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-100">
              Empleados ({isClient ? empleadosFiltrados.length : 0})
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {isClient ? empleadosActivos : 0} Activos
              </span>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {isClient ? empleadosInactivos : 0} Inactivos
              </span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Input de búsqueda - Mejorado para móviles con z-index correcto */}
            <div className="relative flex-1 lg:flex-none">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-[3]">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
              <input 
                type="text" 
                className={`block w-full lg:w-72 p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 relative z-[3] ${
                  isClient 
                    ? 'bg-gray-50 dark:bg-gray-700' 
                    : 'bg-gray-200 dark:bg-gray-800 cursor-not-allowed'
                }`}
                placeholder="Buscar empleados..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!isClient}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 z-[3]"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="w-4 h-4 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                </button>
              )}
            </div>
            
            <button 
              onClick={handleAgregarEmpleado} 
              disabled={!isClient}
              className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-center border rounded-lg transition-all duration-200 whitespace-nowrap relative z-30 flex-shrink-0 ${
                isClient 
                  ? 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:text-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200' 
                  : 'text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Agregar Empleado</span>
              <span className="sm:hidden">Agregar</span>
            </button>
          </div>
        </div>

         {/* Tabla de empleados - Sin limitaciones de altura */}
        <div className="rounded-lg relative z-10 flex-1">
          {!isClient ? (
            // Mostrar loading mientras se hidrata
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center h-full flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <svg className="animate-spin w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="text-gray-500 text-lg font-medium">
                  Cargando empleados...
                </div>
              </div>
            </div>
          ) : empleadosFiltrados.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center h-full flex items-center justify-center">
              <div className="flex flex-col items-center space-y-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="text-gray-500 text-lg font-medium">
                  {searchTerm ? 'No se encontraron empleados' : 'No hay recursos humanos disponibles'}
                </div>
                <div className="text-gray-400 text-sm">
                  {searchTerm 
                    ? `No hay resultados para "${searchTerm}"` 
                    : 'Empieza a ingresar algunos datos.'
                  }
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-200"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>
          ) : (
            <TablaRecursoHumano 
              datos={empleadosFiltrados}
              onEditar={handleEditarEmpleado}
              onDeshabilitar={handleDeshabilitarEmpleado}
            />
          )}
        </div>
       
      </div>
      
      {/* Modal para agregar empleado */}
      {isClient && (
        <AddUserModal 
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveNewEmployee}
        />
      )}
    </div></>
  )
}