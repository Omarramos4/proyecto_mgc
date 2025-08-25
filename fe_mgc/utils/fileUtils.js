// Utilidades para archivos
export const getFileIcon = (fileName, tipoArchivo) => {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  const tipo = tipoArchivo?.toLowerCase();
  if (tipo?.includes('imagen') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) return '🖼️';
  if (extension === 'pdf') return '📄';
  if (['doc', 'docx'].includes(extension)) return '📝';
  return '📁';
};
