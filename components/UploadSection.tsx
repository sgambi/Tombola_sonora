import React, { useCallback, useRef } from 'react';
import { Upload, Music, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { AudioFile } from '../types';

interface UploadSectionProps {
  files: AudioFile[];
  onFilesAdded: (newFiles: File[]) => void;
  onRemoveFile: (id: number) => void;
  onMoveFile: (index: number, direction: 'up' | 'down') => void;
  onStartGame: () => void;
  onClearAll: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  files,
  onFilesAdded,
  onRemoveFile,
  onMoveFile,
  onStartGame,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      onFilesAdded(fileArray);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileArray = Array.from(e.dataTransfer.files).filter((f: File) => f.type.startsWith('audio/'));
      onFilesAdded(fileArray);
    }
  }, [onFilesAdded]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const maxFiles = 90;
  const isLimitReached = files.length >= maxFiles;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Tombola Audio</h1>
          <p className="text-slate-600 text-sm md:text-base">
            Carica fino a {maxFiles} file. Ordinali per associare il numero desiderato.
          </p>
        </div>
        {files.length > 0 && (
          <Button variant="secondary" size="sm" onClick={onClearAll} className="text-red-600 hover:bg-red-50 border-red-200">
            <Trash2 className="w-4 h-4 mr-2" />
            Azzera
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 flex-1 min-h-0">
        {/* Upload Area */}
        <div className="flex flex-col gap-4">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors ${
              isLimitReached
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
                : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 cursor-pointer'
            }`}
            onDrop={!isLimitReached ? handleDrop : undefined}
            onDragOver={handleDragOver}
            onClick={() => !isLimitReached && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="audio/*"
              disabled={isLimitReached}
            />
            <div className="p-4 bg-white rounded-full shadow-sm mb-4">
              <Upload className={`w-8 h-8 ${isLimitReached ? 'text-slate-400' : 'text-indigo-600'}`} />
            </div>
            <p className="text-sm font-medium text-slate-900">
              {isLimitReached ? 'Limite raggiunto' : 'Clicca per caricare o trascina i file'}
            </p>
            <p className="text-xs text-slate-500 mt-1">MP3, WAV, OGG</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-700">Stato Caricamento</span>
              <span className={`text-sm font-bold ${files.length === maxFiles ? 'text-red-600' : 'text-indigo-600'}`}>
                {files.length} / {maxFiles}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${files.length === maxFiles ? 'bg-red-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.min((files.length / maxFiles) * 100, 100)}%` }}
              ></div>
            </div>
            <Button
              className="mt-6"
              fullWidth
              size="lg"
              disabled={files.length === 0}
              onClick={onStartGame}
            >
              AVVIA GIOCO
            </Button>
          </div>
        </div>

        {/* File List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-96 md:h-auto">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Music className="w-4 h-4" />
              File Caricati (Lista Numerata)
            </h3>
          </div>
          <div className="overflow-y-auto custom-scroll p-2 flex-1">
            {files.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Music className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">Nessun file audio caricato</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={file.id} // use key based on ID, not index, so react animates reordering better
                    className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                         type="button"
                         disabled={index === 0}
                         onClick={() => onMoveFile(index, 'up')}
                         className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                         title="Sposta su (Numero inferiore)"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                         type="button"
                         disabled={index === files.length - 1}
                         onClick={() => onMoveFile(index, 'down')}
                         className="p-1 text-slate-400 hover:text-indigo-600 disabled:opacity-20 disabled:hover:text-slate-400 transition-colors"
                         title="Sposta giù (Numero superiore)"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="w-10 h-10 rounded-lg bg-white border-2 border-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0 shadow-sm">
                      {file.id}
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium text-slate-700 truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400">Numero {file.id}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors"
                      title="Rimuovi"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};