import React, { useState, useCallback } from 'react';
import { FileRecord } from './components';

export const useFileUploader = (
  maxSizeInBytes: number,
  acceptedTypes: string[],
  onUpload?: (files: File[]) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress: 100, status: 'complete' } : f
        ));
        if (onUpload) { /* Logic to notify parent if needed for individual completion */ }
      } else {
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, progress } : f
        ));
      }
    }, 200);
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles: FileRecord[] = Array.from(newFiles)
      .filter(file => acceptedTypes.includes(file.type) && file.size <= maxSizeInBytes)
      .map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: 'uploading'
      }));

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
      validFiles.forEach(f => simulateUpload(f.id));
      if (onUpload) {
         // Logic to notify parent of new files added
         const fileObjects = validFiles.map(f => f.file);
         // Note: In a real scenario, you might wait for upload completion or pass raw files immediately
         // onUpload(fileObjects); 
      }
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [acceptedTypes, maxSizeInBytes]); // Dependencies needed for validation logic inside handleFiles if it were memoized, strictly speaking handleFiles should be stable or this dep array correct.

  const removeFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  return {
    isDragging,
    files,
    handleFiles, // Exposed for input onChange
    removeFile,
    dragEvents: {
        onDragOver,
        onDragLeave,
        onDrop
    }
  };
};