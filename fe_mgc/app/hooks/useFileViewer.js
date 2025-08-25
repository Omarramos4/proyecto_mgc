import { useState, useCallback } from 'react';

export function useFileViewer() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileViewer, setShowFileViewer] = useState(false);

  const openFileViewer = useCallback((archivo) => {
    const fileName = archivo.rutaArchivo?.split('/').pop() || archivo.descripcion;
    const extension = fileName?.split('.').pop()?.toLowerCase();
    const fileUrl = `/api/archivo/${archivo.rutaArchivo}`;
    if (extension === 'pdf') {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedFile(archivo);
    setShowFileViewer(true);
  }, []);

  const closeFileViewer = useCallback(() => {
    setSelectedFile(null);
    setShowFileViewer(false);
  }, []);

  return {
    selectedFile,
    showFileViewer,
    openFileViewer,
    closeFileViewer,
    setSelectedFile,
    setShowFileViewer
  };
}
