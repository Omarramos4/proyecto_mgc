'use client';

import React, { useState, useMemo } from 'react';
import { useSuspenseQuery, useMutation } from '@apollo/client';
import { 
  GET_COBERTURA_FORM_DATA 
} from '../app/graphql/operations/catalogos';
import { 
  CREATE_COBERTURA, 
  CREATE_ARCHIVO,
  GET_COBERTURAS
} from '../app/graphql/operations/coberturas';
import { useUserData, useUserSucursal } from '../lib/user-hooks';

const AddCoberturaModal = ({ show, onClose, onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    coberturaId: '',
    cubiertaId: '',
    puestoId: '',
    motivoId: '',
    modalidadId: '',
    fechaInicio: '',
    fechaFin: '',
    justificacion: ''
  });

  const [errors, setErrors] = useState({});
  const [archivos, setArchivos] = useState([]);
  
  // Obtener datos del usuario actual
  const { usuario } = useUserData();
  const { sucursalId } = useUserSucursal();

  // Consultar datos para los comboboxes
  const { data, loading: dataLoading } = useSuspenseQuery(GET_COBERTURA_FORM_DATA);

  // Filtrar recursos humanos por sucursal del usuario logueado
  const recursosHumanosFiltrados = useMemo(() => {
    if (!data?.recursosHumanos || !sucursalId) return [];
    
    return data.recursosHumanos.filter(recurso => {
      const recursoSucursalId = recurso?.ID_Sucursal?.toString() || recurso?.sucursal?.id?.toString();
      return recursoSucursalId === sucursalId.toString();
    });
  }, [data?.recursosHumanos, sucursalId]);

  // Mutation para crear cobertura
  const [createCobertura] = useMutation(CREATE_COBERTURA, {
    refetchQueries: [{ query: GET_COBERTURAS }]
  });

  // Mutation para crear archivos
  const [createArchivo] = useMutation(CREATE_ARCHIVO);

  // Obtener ID del usuario solicitante
  const getSolicitanteId = () => {
    return usuario?.id || null;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error cuando el usuario cambia el valor
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Función para manejar la selección de archivos
  const handleFileSelect = async (files, tipoDocumento) => {
    if (!tipoDocumento) {
      return;
    }

    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validar tamaño del archivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      // Validar tipos de archivo permitidos
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        continue;
      }

      // Agregar archivo a la lista local (sin subir aún)
      const tipoDocumentoObj = data?.tiposArchivos?.find(tipo => tipo.id === tipoDocumento);
      
      const nuevoArchivo = {
        id: Date.now() + Math.random(), // ID temporal único
        file: file,
        tipoDocumento: tipoDocumento,
        tipoDocumentoNombre: tipoDocumentoObj?.descripcion || 'Desconocido',
        rutaArchivo: null, // Se establecerá después de crear la cobertura
        nombreArchivo: file.name,
        descripcion: file.name
      };

      setArchivos(prev => [...prev, nuevoArchivo]);
    }
  };

  // Función para eliminar un archivo
  const handleRemoveFile = (archivoId) => {
    setArchivos(prev => prev.filter(archivo => archivo.id !== archivoId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.coberturaId) {
      newErrors.coberturaId = 'El empleado a realizar la cobertura es requerido';
    }
    if (!formData.cubiertaId) {
      newErrors.cubiertaId = 'El empleado a cubrir es requerido';
    }
    if (!formData.puestoId) {
      newErrors.puestoId = 'El puesto es requerido';
    }
    if (!formData.motivoId) {
      newErrors.motivoId = 'El motivo es requerido';
    }
    if (!formData.modalidadId) {
      newErrors.modalidadId = 'La modalidad es requerida';
    }
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    }
    if (!formData.justificacion.trim()) {
      newErrors.justificacion = 'La justificación es requerida';
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (formData.fechaInicio && formData.fechaFin) {
      if (new Date(formData.fechaFin) <= new Date(formData.fechaInicio)) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      // Solo mostrar validación del formulario dentro del modal
      if (onError) {
        onError({ 
          message: 'Complete todos los campos requeridos para continuar',
          type: 'validation',
          details: 'Revise los campos marcados en rojo y complete la información faltante.'
        });
      }
      return;
    }

    const solicitanteId = getSolicitanteId();
    if (!solicitanteId) {
      if (onError) {
        onError({ 
          message: 'No se pudo obtener la información del usuario',
          type: 'auth',
          details: 'Por favor, cierre sesión e inicie sesión nuevamente.'
        });
      }
      return;
    }

    setIsLoading(true);

    try {
      const fechaSolicitud = new Date().toISOString().split('T')[0];
      
      // 1. Crear la cobertura primero
      const coberturaResult = await createCobertura({
        variables: {
          input: {
            ID_solicitante: solicitanteId,
            ID_cobertura: formData.coberturaId,
            ID_cubierto: formData.cubiertaId,
            ID_puesto: formData.puestoId,
            ID_motivo: formData.motivoId,
            FechaInicio: formData.fechaInicio,
            FechaFin: formData.fechaFin,
            ID_modalidad: formData.modalidadId,
            Justificacion: formData.justificacion,
            FechaSolicitud: fechaSolicitud,
            Estado: 'Pendiente'
          }
        }
      });

      const coberturaId = coberturaResult.data?.createCobertura?.id;
      
      if (!coberturaId) {
        throw new Error('No se pudo obtener el ID de la cobertura creada');
      }

      // 2. Si hay archivos, subirlos y crear registros en la base de datos
      if (archivos.length > 0) {
        const archivosSubidos = await uploadArchivos(coberturaId);
        
        // 3. Crear registros de archivos en la base de datos
        for (const archivoData of archivosSubidos) {
          try {
            await createArchivo({
              variables: {
                input: archivoData
              }
            });
          } catch (error) {
            // Error individual de archivo - continuar con los demás
          }
        }
      }

      setIsLoading(false);
      
      // 4. Llamar al callback de éxito del componente padre
      if (onSuccess) {
        onSuccess({
          ...coberturaResult.data.createCobertura,
          fechaInicio: formData.fechaInicio,
          fechaFin: formData.fechaFin
        });
      }
      
      // 5. Cerrar modal
      handleClose();

    } catch (error) {
      setIsLoading(false);
      
      // Llamar al callback de error del componente padre
      if (onError) {
        onError(error);
      }
    }
  };

  // Función para subir archivos con el ID real de la cobertura
  const uploadArchivos = async (coberturaId) => {
    const archivosSubidos = [];
    
    for (const archivo of archivos) {
      try {
        // Subir archivo al servidor con el ID real de la cobertura
        const formData = new FormData();
        formData.append('file', archivo.file);
        formData.append('tipoDocumento', archivo.tipoDocumento);
        formData.append('coberturaId', coberturaId);

        const response = await fetch('/api/upload-archivo', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          archivosSubidos.push({
            rutaArchivo: result.rutaArchivo,
            descripcion: archivo.descripcion,
            ID_cobertura: coberturaId,
            ID_tipoarchivo: archivo.tipoDocumento
          });
        }
        
      } catch (error) {
        console.error('Error al subir archivo:', error);
      }
    }
    
    return archivosSubidos;
  };

  const handleClose = () => {
    // Limpiar todos los estados
    setFormData({
      coberturaId: '',
      cubiertaId: '',
      puestoId: '',
      motivoId: '',
      modalidadId: '',
      fechaInicio: '',
      fechaFin: '',
      justificacion: ''
    });
    setErrors({});
    setArchivos([]);
    setIsLoading(false);
    onClose();
  };

  // Filtrar recursos humanos disponibles (excluyendo el seleccionado para cobertura)
  const recursosDisponiblesParaCubrir = recursosHumanosFiltrados?.filter(recurso => 
    recurso.id !== formData.coberturaId
  ) || [];

  const SelectField = ({ name, label, value, onChange, options, loading, required, disabled }) => (
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
          {loading ? 'Cargando...' : `Seleccione ${label.toLowerCase()}`}
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
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col">
        {/* Header fijo */}
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 bg-white dark:bg-gray-700 sticky top-0 z-10">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Realizar Nueva Cobertura
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
        
        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Empleado que realizará la cobertura */}
              <SelectField
                name="coberturaId"
                label="Empleado que Realizará la Cobertura"
                value={formData.coberturaId}
                onChange={handleInputChange}
                options={recursosHumanosFiltrados?.map(recurso => ({ 
                  id: recurso.id, 
                  label: `${recurso.Nombres} ${recurso.Apellidos} - ${recurso.DNI} (${recurso.puesto?.Descripcion || 'Sin puesto'})` 
                })) || []}
                loading={dataLoading}
                required={true}
              />
              
              {/* Empleado a cubrir */}
              <SelectField
                name="cubiertaId"
                label="Empleado a Cubrir"
                value={formData.cubiertaId}
                onChange={handleInputChange}
                options={recursosDisponiblesParaCubrir.map(recurso => ({ 
                  id: recurso.id, 
                  label: `${recurso.Nombres} ${recurso.Apellidos} - ${recurso.DNI} (${recurso.puesto?.Descripcion || 'Sin puesto'})` 
                })) || []}
                loading={dataLoading}
                required={true}
                disabled={!formData.coberturaId}
              />
              
              {/* Puesto a cubrir */}
              <SelectField
                name="puestoId"
                label="Puesto a Cubrir"
                value={formData.puestoId}
                onChange={handleInputChange}
                options={data?.puestos?.map(puesto => ({ 
                  id: puesto.id, 
                  label: `${puesto.Descripcion} - ${puesto.area?.NombreArea || 'Sin área'}` 
                })) || []}
                loading={dataLoading}
                required={true}
              />
              
              {/* Motivo de la cobertura */}
              <SelectField
                name="motivoId"
                label="Motivo de la Cobertura"
                value={formData.motivoId}
                onChange={handleInputChange}
                options={data?.motivos?.map(motivo => ({ 
                  id: motivo.id, 
                  label: motivo.Descripcion 
                })) || []}
                loading={dataLoading}
                required={true}
              />
              
              {/* Modalidad de cobertura */}
              <SelectField
                name="modalidadId"
                label="Modalidad de Cobertura"
                value={formData.modalidadId}
                onChange={handleInputChange}
                options={data?.modalidades?.map(modalidad => ({ 
                  id: modalidad.id, 
                  label: modalidad.Descripcion 
                })) || []}
                loading={dataLoading}
                required={true}
              />

              {/* Fecha de inicio */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`bg-gray-50 border ${errors.fechaInicio ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.fechaInicio && (
                  <p className="mt-1 text-sm text-red-500">{errors.fechaInicio}</p>
                )}
              </div>

              {/* Fecha de fin */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Fecha de Fin <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                  min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                  className={`bg-gray-50 border ${errors.fechaFin ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                  required
                />
                {errors.fechaFin && (
                  <p className="mt-1 text-sm text-red-500">{errors.fechaFin}</p>
                )}
              </div>
            </div>

            {/* Justificación - Campo de texto amplio */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Justificación <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.justificacion}
                onChange={(e) => handleInputChange('justificacion', e.target.value)}
                rows={4}
                className={`bg-gray-50 border ${errors.justificacion ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white`}
                placeholder="Ingrese la justificación para esta cobertura..."
                required
              />
              {errors.justificacion && (
                <p className="mt-1 text-sm text-red-500">{errors.justificacion}</p>
              )}
            </div>

            {/* Sección de archivos */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Documentos de Soporte
              </h4>
              
              {/* Componente de subida de archivos */}
              <FileUploadSection 
                tiposArchivos={data?.tiposArchivos || []}
                onFileSelect={handleFileSelect}
                archivos={archivos}
                onRemoveFile={handleRemoveFile}
                loading={dataLoading}
              />
            </div>

          </div>
          
          {/* Footer fijo */}
          <div className="flex flex-col sm:flex-row items-center p-6 space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600 bg-white dark:bg-gray-700">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`w-full sm:w-auto text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-4 focus:outline-none ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              }`}
            >
              Realizar Cobertura
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

// Componente para la sección de subida de archivos
const FileUploadSection = ({ tiposArchivos, onFileSelect, archivos, onRemoveFile, loading }) => {
  const [selectedTipoDocumento, setSelectedTipoDocumento] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!selectedTipoDocumento) {
      return;
    }

    const files = e.dataTransfer.files;
    onFileSelect(files, selectedTipoDocumento);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files, selectedTipoDocumento);
    }
    e.target.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      default:
        return '📎';
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de tipo de documento */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tipo de Documento
        </label>
        <select
          value={selectedTipoDocumento}
          onChange={(e) => setSelectedTipoDocumento(e.target.value)}
          disabled={loading}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        >
          <option value="">
            {loading ? 'Cargando tipos...' : 'Seleccione el tipo de documento'}
          </option>
          {tiposArchivos.map((tipo) => (
            <option key={tipo.id} value={tipo.id}>
              {tipo.descripcion}
            </option>
          ))}
        </select>
      </div>

      {/* Zona de subida de archivos */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600'
        } ${
          !selectedTipoDocumento
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          onChange={handleFileInputChange}
          disabled={!selectedTipoDocumento}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
        />
        
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {!selectedTipoDocumento ? (
              <p>Seleccione un tipo de documento primero</p>
            ) : (
              <>
                <p className="font-medium">Haga clic para seleccionar archivos o arrástrelos aquí</p>
                <p className="text-xs mt-1">PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (máx. 10MB)</p>
                <p className="text-xs mt-1 text-blue-600">Los archivos se subirán al servidor cuando se guarde la cobertura</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lista de archivos agregados */}
      {archivos.length > 0 && (
        <div>
          <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Archivos Seleccionados ({archivos.length})
            <span className="text-xs font-normal text-gray-500 ml-2">
              (Se subirán al guardar la cobertura)
            </span>
          </h5>
          <div className="space-y-2">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(archivo.descripcion)}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {archivo.descripcion}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {archivo.tipoDocumentoNombre}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(archivo.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Eliminar archivo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCoberturaModal;