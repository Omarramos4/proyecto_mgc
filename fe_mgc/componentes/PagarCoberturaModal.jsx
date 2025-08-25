
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import dayjs from 'dayjs';
import OptimizedLoader from './OptimizedLoader';
import { GET_CONFIGURACIONES } from '../app/graphql/operations/catalogos';
import { CREATE_HONORARIO, GET_COBERTURA_DETALLES } from '../app/graphql/operations/honorariosCobertura';

const PagarCoberturaModal = ({ show, onClose, cobertura: initialCobertura }) => {
  const [relojMarcador, setRelojMarcador] = useState(0);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const [getCobertura, { data: coberturaData, loading: coberturaLoading, error: coberturaError }] = useLazyQuery(GET_COBERTURA_DETALLES);

  useEffect(() => {
    if (show && initialCobertura?.id) {
      console.log('PagarCoberturaModal: Abriendo modal para cobertura ID:', initialCobertura.id);
      getCobertura({ variables: { id: initialCobertura.id } });
    }
  }, [show, initialCobertura, getCobertura]);

  useEffect(() => {
    if (coberturaData) {
      console.log('PagarCoberturaModal: Datos recibidos de GET_COBERTURA_DETALLES:', coberturaData);
    }
    if (coberturaError) {
      console.error('PagarCoberturaModal: Error de GET_COBERTURA_DETALLES:', coberturaError);
    }
  }, [coberturaData, coberturaError]);

  const cobertura = coberturaData?.cobertura || initialCobertura;

  const { data: configData, loading: configLoading, error: configError } = useQuery(GET_CONFIGURACIONES);
  
  const [createHonorario, { loading: mutationLoading }] = useMutation(CREATE_HONORARIO, {
    onCompleted: () => {
      showNotification('success', 'Pago realizado', 'El pago se realizó correctamente', false);
      console.log('PagarCoberturaModal: Honorario creado con éxito.');
      setTimeout(() => {
        setNotification(null);
        setNotificationVisible(false);
        onClose();
      }, 2000);
    },
    onError: (err) => {
      showNotification('error', 'Error al pagar', err.message);
      console.error('PagarCoberturaModal: Objeto de error completo de la mutación createHonorario:', err);
      setError(`Error al crear el honorario: ${err.message}`);
    }
  });

  // Función para mostrar notificaciones
  const showNotification = (type, title, message, autoClose = true) => {
    setNotification({ type, title, message });
    setNotificationVisible(true);
    if (autoClose) {
      setTimeout(() => {
        setNotificationVisible(false);
        setNotification(null);
      }, 3000);
    }
  };

  const closeNotification = () => {
    setNotificationVisible(false);
    setNotification(null);
  };

  // Renderizar notificación
  const renderNotification = () => {
    if (!notification) return null;
    const { type, title, message } = notification;
    const getNotificationStyles = () => {
      switch (type) {
        case 'success':
          return 'bg-green-100 border-green-400 text-green-800';
        case 'error':
          return 'bg-red-100 border-red-400 text-red-800';
        case 'warning':
          return 'bg-yellow-100 border-yellow-400 text-yellow-800';
        default:
          return 'bg-blue-100 border-blue-400 text-blue-800';
      }
    };
    const styles = getNotificationStyles();
    return (
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[99999] px-4 py-3 border rounded-lg shadow-lg flex items-center space-x-3 ${styles}`} style={{ minWidth: '320px', maxWidth: '90vw' }}>
        <div className="flex-1">
          <div className="font-bold text-base">{title}</div>
          <div className="text-sm">{message}</div>
        </div>
        <button onClick={closeNotification} className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  const { sueldoGeneral, isrRate, issRate } = useMemo(() => {
    const sueldo = cobertura?.puesto?.SueldoGeneral || 0;
    if (configLoading || configError) {
      return { sueldoGeneral: sueldo, isrRate: 0, issRate: 0 };
    }
    const isrConfig = configData?.configuraciones.find(c => c.nombre === 'ISR');
    const issConfig = configData?.configuraciones.find(c => c.nombre === 'ISS');
    return {
      sueldoGeneral: sueldo,
      isrRate: isrConfig ? parseFloat(isrConfig.valor) : 0,
      issRate: issConfig ? parseFloat(issConfig.valor) : 0,
    };
  }, [cobertura, configData, configLoading, configError]);

  const { isrCalculado, issCalculado, totalDeduccion, pagoNeto } = useMemo(() => {
    const isr = sueldoGeneral * isrRate;
    const iss = sueldoGeneral * issRate;
    const deducciones = isr + iss + (parseFloat(relojMarcador) || 0);
    const neto = sueldoGeneral - deducciones;
    return {
      isrCalculado: isr,
      issCalculado: iss,
      totalDeduccion: deducciones,
      pagoNeto: neto,
    };
  }, [sueldoGeneral, isrRate, issRate, relojMarcador]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!cobertura?.cubierto?.id || !cobertura?.id) {
        setError("Faltan datos de la cobertura para procesar el pago.");
        return;
    }


    const input = {
      ID_recursohumano: cobertura.cubierto.id,
      ID_cobertura: cobertura.id,
      ISR: isrCalculado,
      ISS: issCalculado,
      RelojMarcador: parseFloat(relojMarcador) || 0,
      totalDeduccion: totalDeduccion,
      pagoNeto: pagoNeto,
      fechaHora_honorario: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    console.log('PagarCoberturaModal: Enviando datos con la siguiente entrada:', input);
    createHonorario({ variables: { input } });
  };

  if (!show) return null;

  return (
    <>
      {notification && notificationVisible && createPortal(renderNotification(), document.body)}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md m-4">
        <div className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pagar Cobertura #{cobertura.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {(configLoading || coberturaLoading) && <OptimizedLoader />}
        
        {configError && <div className="my-4 text-red-500">Error cargando configuración: {configError.message}</div>}
        {coberturaError && <div className="my-4 text-red-500">Error cargando datos de la cobertura: {coberturaError.message}</div>}

        {!configLoading && !configError && !coberturaLoading && !coberturaError && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sueldo General</label>
              <input type="text" readOnly value={`L ${sueldoGeneral.toFixed(2)}`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
            </div>
            
            <div>
              <label htmlFor="relojMarcador" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deducción Reloj Marcador</label>
              <input
                id="relojMarcador"
                type="number"
                step="0.01"
                value={relojMarcador}
                onChange={(e) => setRelojMarcador(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISR ({isrRate * 100}%)</label>
                    <input type="text" readOnly value={`L ${isrCalculado.toFixed(2)}`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ISS ({issRate * 100}%)</label>
                    <input type="text" readOnly value={`L ${issCalculado.toFixed(2)}`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Deducciones</label>
              <input type="text" readOnly value={`L ${totalDeduccion.toFixed(2)}`} className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-bold text-green-600 dark:text-green-400">Pago Neto</label>
              <input type="text" readOnly value={`L ${pagoNeto.toFixed(2)}`} className="mt-1 block w-full px-3 py-2 bg-green-50 dark:bg-green-900 border border-green-300 dark:border-green-600 rounded-md shadow-sm text-lg font-bold text-green-800 dark:text-green-200" />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex justify-end pt-4 space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:bg-gray-600">
                Cancelar
              </button>
              <button type="submit" disabled={mutationLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 dark:disabled:bg-green-800">
                {mutationLoading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>

    </>
  );
};


export default PagarCoberturaModal;
