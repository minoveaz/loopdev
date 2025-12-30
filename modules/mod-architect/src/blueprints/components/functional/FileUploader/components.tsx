
import React from 'react';
import { formatSize, getFileIcon, getIconColorBg } from '@blueprints/components/functional/FileUploader/utils';

// --- Types ---
export interface FileRecord {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export const UploadDropZone: React.FC<{
  isDragging: boolean;
  onClick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  acceptedTypes: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isDragging, onClick, onDragOver, onDragLeave, onDrop, acceptedTypes, inputRef, onFileSelect }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      onClick={onClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload file drop zone"
      className={`
        border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer mb-6 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${isDragging 
          ? 'border-primary bg-primary/5 dark:bg-primary/10' // Replaced bg-blue-50 with bg-primary/5
          : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        multiple 
        accept={acceptedTypes.join(',')}
        onChange={onFileSelect}
        tabIndex={-1}
      />
      <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center mb-3 transition-colors ${isDragging ? 'bg-white text-primary' : 'bg-white dark:bg-slate-700'}`}>
        <span className={`material-symbols-outlined text-2xl text-primary`}>cloud_upload</span>
      </div>
      <h3 className="text-sm font-bold text-[#0d121b] dark:text-white mb-1">Click to upload or drag and drop</h3>
      <p className="text-xs text-slate-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
    </div>
  );
};

export const FileListItem: React.FC<{
  fileRecord: FileRecord;
  onRemove: (id: string) => void;
}> = ({ fileRecord, onRemove }) => (
  <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg p-3 flex items-center gap-3">
    <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${getIconColorBg(fileRecord.file.type)}`}>
      <span className="material-symbols-outlined text-sm">{getFileIcon(fileRecord.file.type)}</span>
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-[#0d121b] dark:text-white truncate max-w-[150px] sm:max-w-[200px]">
          {fileRecord.file.name}
        </span>
        {fileRecord.status === 'complete' ? (
          <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Complete
          </span>
        ) : (
          <span className="text-xs font-mono text-slate-400">{Math.round(fileRecord.progress)}%</span>
        )}
      </div>
      
      {fileRecord.status === 'uploading' ? (
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-200 ease-out" 
            style={{ width: `${fileRecord.progress}%` }}
          ></div>
        </div>
      ) : (
        <span className="text-xs text-slate-400">{formatSize(fileRecord.file.size)}</span>
      )}
    </div>

    <button 
      onClick={(e) => { e.stopPropagation(); onRemove(fileRecord.id); }}
      className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
      aria-label="Remove file"
    >
      <span className="material-symbols-outlined text-lg">
        {fileRecord.status === 'uploading' ? 'cancel' : 'delete'}
      </span>
    </button>
  </div>
);
