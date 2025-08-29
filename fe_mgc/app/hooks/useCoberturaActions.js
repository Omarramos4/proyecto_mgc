import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_COBERTURA, CREATE_ARCHIVO } from '../graphql/operations/coberturas';

export function useCoberturaActions(coberturaId, user, onClose) {
  const [notification, setNotification] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [updateCobertura] = useMutation(UPDATE_COBERTURA, {
    update: (cache, { data }) => {
      // Si la mutación retorna la cobertura actualizada
      const coberturaActualizada = data?.updateCobertura;
      if (!coberturaActualizada) return;
      try {
        cache.modify({
          id: cache.identify({ __typename: 'Cobertura', id: coberturaActualizada.id }),
          fields: {
            Estado() {
              return coberturaActualizada.Estado;
            }
          }
        });
      } catch (e) {
        console.error('Error actualizando el cache de Estado de cobertura:', e);
      }
    }
  });
  const [createArchivo] = useMutation(CREATE_ARCHIVO);

  const showNotification = useCallback((type, title, message, autoClose = true) => {
    setNotification({ type, title, message });
    setTimeout(() => setNotificationVisible(true), 100);
    if (autoClose) {
      setTimeout(() => {
        setNotificationVisible(false);
        setTimeout(() => setNotification(null), 300);
      }, 3000);
    }
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationVisible(false);
    setTimeout(() => setNotification(null), 300);
  }, []);

  const handleFileUpload = useCallback(async (file, type) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoDocumento', type);
    formData.append('coberturaId', coberturaId);
    if (type === 'rejection' && user?.id) {
      formData.append('userId', user.id);
    }
    try {
      const response = await fetch('/api/upload-archivo', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Error al cargar el archivo');
      const result = await response.json();
      return result.rutaArchivo;
    } catch (error) {
      throw error;
    }
  }, [coberturaId, user]);

  const aprobarCobertura = useCallback(async (directorFile, hrFile, setUploadProgress, setDirectorFile, setHrFile, onSuccess) => {
    if (!directorFile || !hrFile) {
      showNotification('error', 'Archivos requeridos', 'Cargue ambos archivos para aprobar');
      return;
    }
    try {
      setUploadProgress(prev => ({ ...prev, director: 30 }));
      const directorPath = await handleFileUpload(directorFile, 'director');
      setUploadProgress(prev => ({ ...prev, director: 60 }));
      setUploadProgress(prev => ({ ...prev, hr: 30 }));
      const hrPath = await handleFileUpload(hrFile, 'hr');
      setUploadProgress(prev => ({ ...prev, hr: 60 }));

      await createArchivo({
        variables: {
          input: {
            rutaArchivo: directorPath,
            descripcion: 'Archivo de Revisión del Director',
            ID_cobertura: coberturaId,
            ID_tipoarchivo: 1,
          },
        },
      });
      setUploadProgress(prev => ({ ...prev, director: 80 }));

      await createArchivo({
        variables: {
          input: {
            rutaArchivo: hrPath,
            descripcion: 'Archivo de Revisión del Encargado de RR.HH.',
            ID_cobertura: coberturaId,
            ID_tipoarchivo: 1,
          },
        },
      });
      setUploadProgress(prev => ({ ...prev, hr: 80 }));

      await updateCobertura({
        variables: {
          id: coberturaId,
          input: { Estado: 'Aprobado' },
        },
      });

      setUploadProgress({ director: 100, hr: 100 });
      setDirectorFile(null);
      setHrFile(null);
      setUploadProgress({ director: 0, hr: 0 });

      showNotification('success', 'Cobertura Aprobada', 'Se aprobó la Cobertura', false);
      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification('error', 'Error al aprobar', 'Error al procesar la aprobación');
    }
  }, [coberturaId, handleFileUpload, createArchivo, updateCobertura, showNotification]);

  const rechazarCobertura = useCallback(async (rejectionFile, setRejectionProgress, setRejectionFile, onSuccess) => {
    if (!rejectionFile) {
      showNotification('error', 'Archivo requerido', 'Cargue el archivo de justificación para rechazar');
      return;
    }
    try {
      setRejectionProgress(30);
      const rejectionPath = await handleFileUpload(rejectionFile, 'rejection');
      setRejectionProgress(60);

      await createArchivo({
        variables: {
          input: {
            rutaArchivo: rejectionPath,
            descripcion: 'Justificación de Rechazo',
            ID_cobertura: coberturaId,
            ID_tipoarchivo: 1,
          },
        },
      });
      setRejectionProgress(80);

      await updateCobertura({
        variables: {
          id: coberturaId,
          input: { Estado: 'Rechazado' },
        },
      });

      setRejectionProgress(100);
      setRejectionFile(null);
      setRejectionProgress(0);

      showNotification('warning', 'Cobertura Rechazada', 'Se rechazó la Cobertura', false);
      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification('error', 'Error al rechazar', 'Error al procesar el rechazo');
    }
  }, [coberturaId, handleFileUpload, createArchivo, updateCobertura, showNotification]);

  return {
    notification,
    notificationVisible,
    showNotification,
    closeNotification,
    aprobarCobertura,
    rechazarCobertura,
  };
}
