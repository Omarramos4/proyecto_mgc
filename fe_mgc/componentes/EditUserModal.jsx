'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

const ModalField = ({ field, value, onChange }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      {field.label}
    </label>
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(field.key, e.target.value)}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
      placeholder={field.placeholder}
      required={field.required}
    />
  </div>
);

const EditUserModal = ({ show, onClose, onSave, userData }) => {
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (userData) {
      setEditFormData({ ...userData });
    } else {
      setEditFormData({});
    }
  }, [userData]);

  const handleInputChange = useCallback((field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(editFormData);
  }, [onSave, editFormData]);

  const editableFields = useMemo(() => [
    { key: 'nombre', label: 'Nombres', placeholder: 'Nombres del empleado', required: true },
    { key: 'apellido', label: 'Apellidos', placeholder: 'Apellidos del empleado', required: true },
    { key: 'cedula', label: 'DNI', placeholder: 'DNI del empleado', required: true },
    { key: 'ctaBanco', label: 'Cuenta Bancaria', placeholder: 'Cuenta bancaria del empleado' },
    { key: 'origen', label: 'Origen', placeholder: 'Origen del empleado' }
  ], []);

  if (!show) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Empleado
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editableFields.map((field) => (
                <ModalField 
                  key={field.key} 
                  field={field} 
                  value={editFormData[field.key]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center p-6 space-y-2 sm:space-y-0 sm:space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Guardar Cambios
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
