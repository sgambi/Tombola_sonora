import React, { useState, useEffect, useRef } from 'react';
import { Volume2, RefreshCw, RotateCcw, Play } from 'lucide-react';
import { Button } from './Button';
import { AudioFile } from '../types';

interface GameSectionProps {
  files: AudioFile[];
  onResetApp: () => void;
}

export const GameSection: React.FC<GameSectionProps> = ({ files, onResetApp }) => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Game completion check
  const isGameOver = drawnNumbers.length === files.length;

  const handleDrawNumber = () => {
    if (isPlaying || isGameOver) return;

    // Filter available numbers
    const availableNumbers = files
      .map(f => f.id)
      .filter(id => !drawnNumbers.includes(id));

    if (availableNumbers.length === 0) return;

    // Pick random
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedId = availableNumbers[randomIndex];

    // Update state
    setDrawnNumbers(prev => [...prev, selectedId]);
    setCurrentNumber(selectedId);
    
    // Play audio
    playAudio(selectedId);
  };

  const playAudio = (id: number) => {
    const file = files.find(f => f.id === id);
    if (file) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(file.url);
      audioRef.current = audio;
      setIsPlaying(true);
      
      audio.play().catch(e => console.error("Playback failed", e));
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      // Fallback if audio fails or is super short/cached weirdly
      audio.onerror = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleRestartGame = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setIsPlaying(false);
  };

  // Calculate grid columns based on file count for optimal layout
  const getGridCols = () => {
    const count = files.length;
    if (count <= 10) return "grid-cols-2 sm:grid-cols-5"; // Big boxes
    if (count <= 25) return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6";
    if (count <= 50) return "grid-cols-5 sm:grid-cols-8 md:grid-cols-10";
    return "grid-cols-6 sm:grid-cols-10 md:grid-cols-12"; // Max density
  };

  const currentFile = currentNumber ? files.find(f => f.id === currentNumber) : null;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header / Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-4">
           <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Tombola Audio</h1>
           <div className="flex gap-2">
             <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                Totale: {files.length}
             </div>
             <div className="px-3 py-1 bg-indigo-50 rounded-full text-xs font-medium text-indigo-600">
                Estratti: {drawnNumbers.length}
             </div>
           </div>
        </div>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onResetApp}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          Azzera Tutto
        </Button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Controls & Current Number */}
        <div className="md:w-1/3 lg:w-1/4 p-6 bg-white border-r border-slate-200 flex flex-col items-center justify-center gap-8 shadow-sm z-0">
          
          {/* Current Drawn Display */}
          <div className="flex flex-col items-center justify-center w-full">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">Ultimo Numero</span>
            <div className={`
              w-48 h-48 rounded-3xl flex items-center justify-center text-8xl font-black shadow-lg transition-all duration-300
              ${currentNumber 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white scale-100' 
                : 'bg-slate-100 text-slate-300 scale-95 border-2 border-dashed border-slate-200'}
            `}>
              {currentNumber || '-'}
            </div>
            
            {/* File Name Display */}
            <div className="mt-4 h-12 text-center w-full px-4">
              {currentFile && (
                <div className="animate-fade-in flex flex-col items-center">
                   <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                      {isPlaying && <Volume2 className="w-4 h-4 animate-pulse" />}
                      <span className="text-xs font-bold uppercase">{isPlaying ? 'Riproduzione...' : 'Riprotto'}</span>
                   </div>
                   <p className="text-sm text-slate-700 truncate max-w-full font-medium" title={currentFile.name}>
                     {currentFile.name}
                   </p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="w-full space-y-4">
            <Button 
              size="lg" 
              fullWidth 
              onClick={handleDrawNumber}
              disabled={isPlaying || isGameOver}
              className={`h-16 text-lg shadow-md transition-transform active:scale-95 ${
                isGameOver ? 'bg-slate-300' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {isGameOver ? (
                  <span>Tombola Finita!</span>
                ) : (
                  <>
                    <Play className="w-6 h-6 fill-current" />
                    <span>Estrai Numero</span>
                  </>
                )}
              </div>
            </Button>

            <div className="pt-4 border-t border-slate-100 w-full">
              <Button 
                variant="ghost" 
                fullWidth 
                onClick={handleRestartGame}
                className="text-slate-500 hover:text-indigo-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Ricomincia Partita
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: The Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <div className={`grid ${getGridCols()} gap-3 content-start`}>
            {files.map((file) => {
              const isDrawn = drawnNumbers.includes(file.id);
              const isCurrent = currentNumber === file.id;

              return (
                <div
                  key={file.id}
                  className={`
                    relative aspect-square flex items-center justify-center rounded-xl font-bold text-xl sm:text-2xl transition-all duration-500
                    ${isCurrent 
                      ? 'bg-indigo-600 text-white shadow-lg scale-110 z-10 ring-4 ring-indigo-200' 
                      : isDrawn 
                        ? 'bg-indigo-100 text-indigo-700 shadow-inner' 
                        : 'bg-white text-slate-300 border border-slate-200'}
                  `}
                >
                  {file.id}
                  {isDrawn && !isCurrent && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Volume2 className="w-2/3 h-2/3" />
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};