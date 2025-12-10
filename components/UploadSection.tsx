import React, { useCallback, useRef } from 'react';
import { Upload, Music, X, ChevronUp, ChevronDown, Trash2, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-full w-full p-4 overflow-y-auto custom-scroll">
      <div className="max-w-5xl mx-auto w-full bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] rounded-3xl p-6 md:p-8 my-4 flex flex-col gap-6">
        
        {/* Header Giocoso */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase tracking-wider flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-sky-400 fill-current animate-bounce" />
              Tombola Audio
            </h1>
            <p className="text-slate-500 font-bold text-lg mt-2">
              Prepara i suoni per la classe! ({files.length} / {maxFiles})
            </p>
          </div>
          {files.length > 0 && (
            <Button variant="danger" size="md" onClick={onClearAll}>
              <Trash2 className="w-5 h-5 mr-2" />
              Ricomincia da Zero
            </Button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Zona Upload */}
          <div className="flex flex-col gap-6">
            <div
              className={`flex flex-col items-center justify-center border-4 border-dashed rounded-3xl p-8 transition-all duration-300 group ${
                isLimitReached
                  ? 'border-slate-300 bg-slate-100 cursor-not-allowed opacity-60'
                  : 'border-sky-300 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 hover:scale-[1.02] cursor-pointer'
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
              <div className={`p-6 rounded-full border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] mb-4 transition-transform group-hover:rotate-12 ${isLimitReached ? 'bg-slate-200' : 'bg-white'}`}>
                <Upload className={`w-10 h-10 ${isLimitReached ? 'text-slate-400' : 'text-sky-500'}`} />
              </div>
              <p className="text-xl font-black text-slate-700 uppercase">
                {isLimitReached ? 'Tutto Pieno!' : 'Tocca qui'}
              </p>
              <p className="text-base font-bold text-slate-400 mt-1">
                o trascina i file audio
              </p>
            </div>

            {/* Progress Bar Giocosa */}
            <div className="bg-orange-50 rounded-2xl border-[3px] border-orange-200 p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-orange-400 uppercase tracking-wide">Stato File</span>
                <span className="font-black text-2xl text-orange-500">
                  {files.length} <span className="text-base text-orange-300">su</span> {maxFiles}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-6 border-2 border-orange-200 overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${Math.min((files.length / maxFiles) * 100, 100)}%` }}
                >
                    {files.length > 0 && <div className="w-2 h-2 bg-white rounded-full opacity-50 animate-pulse" />}
                </div>
              </div>
              
              <Button
                className="mt-6 w-full"
                size="xl"
                variant="success"
                disabled={files.length === 0}
                onClick={onStartGame}
              >
                GIOCHIAMO! 🚀
              </Button>
            </div>
          </div>

          {/* Lista File stile "Biglietti" */}
          <div className="bg-sky-50 rounded-3xl border-[3px] border-sky-200 flex flex-col overflow-hidden h-[500px]">
            <div className="p-4 bg-sky-100 border-b-2 border-sky-200">
              <h3 className="font-black text-sky-600 text-xl flex items-center gap-2 uppercase">
                <Music className="w-6 h-6" />
                La tua Playlist
              </h3>
            </div>
            <div className="overflow-y-auto custom-scroll p-4 flex-1 space-y-3">
              {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-sky-300 space-y-4">
                  <Music className="w-20 h-20 opacity-40 animate-bounce" />
                  <p className="font-bold text-xl opacity-60">La lista è vuota...</p>
                </div>
              ) : (
                files.map((file, index) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-sky-100 shadow-sm hover:border-sky-300 transition-colors group"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                         type="button"
                         disabled={index === 0}
                         onClick={() => onMoveFile(index, 'up')}
                         className="p-1 bg-slate-100 rounded hover:bg-sky-200 text-slate-500 hover:text-sky-700 disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                         type="button"
                         disabled={index === files.length - 1}
                         onClick={() => onMoveFile(index, 'down')}
                         className="p-1 bg-slate-100 rounded hover:bg-sky-200 text-slate-500 hover:text-sky-700 disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center text-lg font-black text-black shrink-0 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {file.id}
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-bold text-slate-800 truncate text-lg" title={file.name}>
                        {file.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveFile(file.id)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all hover:scale-110"
                    >
                      <X className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};