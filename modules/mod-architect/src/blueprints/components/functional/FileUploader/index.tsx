import React, { useRef } from 'react';
import { UploadDropZone, FileListItem } from './components';
import { useFileUploader } from './useFileUploader';

interface FileUploaderProps {
  onUpload?: (files: File[]) => void;
  maxSizeInBytes?: number;
  acceptedTypes?: string[];
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onUpload,
  maxSizeInBytes = 5 * 1024 * 1024,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'application/pdf'],
  className = ""
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    isDragging, 
    files, 
    handleFiles, 
    removeFile, 
    dragEvents 
  } = useFileUploader(maxSizeInBytes, acceptedTypes, onUpload);

  return (
    <div className={`bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm ${className}`}>
      <UploadDropZone 
        isDragging={isDragging}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={dragEvents.onDragOver}
        onDragLeave={dragEvents.onDragLeave}
        onDrop={dragEvents.onDrop}
        acceptedTypes={acceptedTypes}
        inputRef={fileInputRef}
        onFileSelect={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col gap-3">
        {files.length > 0 && <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Uploading</h4>}
        {files.map((fileRecord) => (
          <FileListItem 
            key={fileRecord.id} 
            fileRecord={fileRecord} 
            onRemove={removeFile} 
          />
        ))}
      </div>
    </div>
  );
};