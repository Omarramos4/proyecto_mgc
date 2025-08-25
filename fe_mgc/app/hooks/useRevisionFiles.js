import { useState, useCallback } from 'react';

export function useRevisionFiles() {
  const [directorFile, setDirectorFile] = useState(null);
  const [hrFile, setHrFile] = useState(null);
  const [rejectionFile, setRejectionFile] = useState(null);

  const handleFileChange = useCallback((event, type) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'director') {
        setDirectorFile(file);
      } else if (type === 'hr') {
        setHrFile(file);
      } else if (type === 'rejection') {
        setRejectionFile(file);
      }
    }
  }, []);

  return {
    directorFile,
    setDirectorFile,
    hrFile,
    setHrFile,
    rejectionFile,
    setRejectionFile,
    handleFileChange
  };
}
