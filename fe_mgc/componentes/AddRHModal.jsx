'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AREAS, GET_PUESTOS } from '../app/graphql/operations/catalogos';
import { useNotification } from './Notification';
import { useUserData, useUserSucursal } from '../lib/user-hooks';

const AddRHModal = ({ show, onClose, onSave }) => {
  // Hook para notificaciones
  const { showNotification, NotificationComponent } = useNotification();

  // Queries para obtener datos de catálogos
  const { data: areasData, loading: areasLoading, error: areasError } = useQuery(GET_AREAS);
  const { data: puestosData, loading: puestosLoading, error: puestosError } = useQuery(GET_PUESTOS);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    puestoId: '',
    areaId: '',
    sucursalId: '',
    ctaBanco: '',
    origen: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar el nuevo hook para obtener datos del usuario
  const { usuario: currentUser, loading: userLoading } = useUserData();
  const { sucursalId, sucursalNombre } = useUserSucursal();

  // Actualizar el formulario cuando se carguen los datos del usuario
  useEffect(() => {
    if (currentUser && sucursalId) {
      setFormData(prev => ({
        ...prev,
        sucursalId: sucursalId
      }));
    }
  }, [currentUser, sucursalId]);

  // Filtrar puestos por área seleccionada
  const puestosFiltrados = useMemo(() => {
    if (!formData.areaId || !puestosData?.puestos) return [];
    
    return puestosData.puestos.filter(puesto => {
      // Convertir ambos a string para comparar (GraphQL puede devolver string o number)
      const puestoAreaId = String(puesto.ID_Area);
      const areaSeleccionada = String(formData.areaId);
      return puestoAreaId === areaSeleccionada;
    });
  }, [formData.areaId, puestosData]);

  // Obtener datos de catálogos
  const areas = useMemo(() => {
    if (!areasData?.areas) return [];
    return areasData.areas;
  }, [areasData]);
  
  // Las sucursales ya no se obtienen de la query sino del usuario actual
  
  // Opciones para el campo Origen
  const origenOptions = [
    { id: 'Interno', label: 'Interno' },
    { id: 'Externo', label: 'Externo' }
  ];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // Si cambia el área, limpiar el puesto seleccionado
      if (field === 'areaId') {
        newData.puestoId = '';
      }
      
      return newData;
    });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, []); // Remover dependencia de errors que causa re-renders

  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es obligatorio';
    }
    
    if (!formData.cedula.trim()) {
      newErrors.cedula = 'El DNI es obligatorio';
    } else if (!/^\d+$/.test(formData.cedula)) {
      newErrors.cedula = 'El DNI debe contener solo números';
    }
    
    if (!formData.areaId) {
      newErrors.areaId = 'El área es obligatoria';
    }
    
    if (!formData.puestoId) {
      newErrors.puestoId = 'El puesto es obligatorio';
    }
    
    // La sucursal ya no se valida porque se asigna automáticamente
    if (!formData.sucursalId) {
      newErrors.sucursalId = 'Error: No se pudo obtener la sucursal del usuario';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleClose = useCallback(() => {
    setFormData({
      nombre: '',
      apellido: '',
      cedula: '',
      puestoId: '',
      areaId: '',
      sucursalId: sucursalId || '', // Usar la sucursal del usuario logueado
      ctaBanco: '',
      origen: ''
    });
    setErrors({});
    onClose();
  }, [onClose, sucursalId]);

  const handleSave = useCallback(async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Preparar datos para enviar - Estado automáticamente 1
        const dataToSave = {
          Nombres: formData.nombre,
          Apellidos: formData.apellido,
          DNI: formData.cedula,
          CtaBanco: formData.ctaBanco || null,
          Origen: formData.origen || null,
          Estado: "1", // Estado automáticamente activo
          ID_Puesto: formData.puestoId,
          ID_Sucursal: formData.sucursalId
        };
        
        await onSave(dataToSave);
        
        // Cerrar modal 
        handleClose();
      } catch (error) {
        console.error('Error al guardar empleado:', error);
        // Solo mostrar error en el modal, el éxito se maneja en el padre
        showNotification('Error al agregar empleado. Por favor, inténtelo nuevamente.', 'error', {
          title: '¡Error!',
          details: 'Revise los datos ingresados y la conexión al servidor'
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData, onSave, showNotification, validateForm, handleClose]);

  const SelectField = ({ name, label, value, onChange, options, loading, required = false, disabled = false, error = null }) => (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled || loading}
        className={`bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">
          {loading ? 'Cargando...' : 
           error ? 'Error al cargar datos' : 
           options.length === 0 ? `No hay ${label.toLowerCase()} disponibles` :
           `Seleccione ${label.toLowerCase()}`}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
      )}
      {error && !errors[name] && (
        <p className="mt-1 text-sm text-red-500">Error al cargar datos</p>
      )}
    </div>
  );

  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Componente de notificación */}
      <NotificationComponent />

      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Agregar Nuevo Empleado
            </h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`bg-gray-50 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Ingrese los nombres del empleado"
                  required
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => handleInputChange('apellido', e.target.value)}
                  className={`bg-gray-50 border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Ingrese los apellidos del empleado"
                  required
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-500">{errors.apellido}</p>
                )}
              </div>

              {/* DNI */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange('cedula', e.target.value)}
                  className={`bg-gray-50 border ${errors.cedula ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  placeholder="Ingrese el DNI del empleado"
                  required
                />
                {errors.cedula && (
                  <p className="mt-1 text-sm text-red-500">{errors.cedula}</p>
                )}
              </div>

              {/* Cuenta Bancaria */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Cuenta Bancaria
                </label>
                <input
                  type="text"
                  value={formData.ctaBanco}
                  onChange={(e) => handleInputChange('ctaBanco', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Ingrese la cuenta bancaria"
                  required={true}
                />
              </div>

              {/* Origen */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Origen
                </label>
                <select
                  value={formData.origen}
                  onChange={(e) => handleInputChange('origen', e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                  <option value="">Seleccione origen</option>
                  {origenOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Selección de Área */}
              <SelectField
                name="areaId"
                label="Área"
                value={formData.areaId}
                onChange={handleInputChange}
                options={areas.map(area => ({ id: area.id, label: area.NombreArea }))}
                loading={areasLoading}
                error={areasError}
                required={true}
              />
              
              {/* Selección de Puesto */}
              <SelectField
                name="puestoId"
                label="Puesto"
                value={formData.puestoId}
                onChange={handleInputChange}
                options={puestosFiltrados.map(puesto => ({ id: puesto.id, label: puesto.Descripcion }))}
                loading={puestosLoading}
                error={puestosError}
                required={true}
                disabled={!formData.areaId}
              />
              
              {/* Sucursal (solo lectura) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sucursal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={sucursalNombre || 'Cargando sucursal...'}
                  readOnly
                  className="bg-gray-100 border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300 cursor-not-allowed"
                  placeholder="Sucursal asignada automáticamente"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  La sucursal se asigna automáticamente.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center p-6 space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`w-full sm:w-auto text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-700 hover:bg-green-800 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </div>
              ) : (
                'Agregar Empleado'
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={`w-full sm:w-auto text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRHModal;
