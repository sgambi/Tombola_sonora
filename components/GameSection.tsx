import React, { useState, useRef } from 'react';
import { Volume2, RefreshCw, Play, Trophy } from 'lucide-react';
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
  
  const isGameOver = drawnNumbers.length === files.length;

  const handleDrawNumber = () => {
    if (isPlaying || isGameOver) return;

    const availableNumbers = files
      .map(f => f.id)
      .filter(id => !drawnNumbers.includes(id));

    if (availableNumbers.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedId = availableNumbers[randomIndex];

    setDrawnNumbers(prev => [...prev, selectedId]);
    setCurrentNumber(selectedId);
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
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    }
  };

  const handleRestartGame = () => {
    if (audioRef.current) audioRef.current.pause();
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setIsPlaying(false);
  };

  const getGridCols = () => {
    const count = files.length;
    if (count <= 10) return "grid-cols-2 sm:grid-cols-5";
    if (count <= 25) return "grid-cols-4 sm:grid-cols-5 md:grid-cols-6";
    if (count <= 50) return "grid-cols-5 sm:grid-cols-8 md:grid-cols-10";
    return "grid-cols-6 sm:grid-cols-10 md:grid-cols-12";
  };

  const currentFile = currentNumber ? files.find(f => f.id === currentNumber) : null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Bar Semplificata */}
      <header className="bg-white/90 backdrop-blur border-b-[3px] border-black px-4 py-3 flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
           <div className="bg-yellow-400 p-2 rounded-lg border-2 border-black">
             <Trophy className="w-6 h-6 text-black" />
           </div>
           <h1 className="text-2xl font-black text-slate-800 tracking-tight hidden sm:block uppercase">Tombola!</h1>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 bg-sky-100 rounded-xl border-2 border-sky-300 font-bold text-sky-700 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
              TOTALE: {files.length}
           </div>
           <div className="px-4 py-2 bg-green-100 rounded-xl border-2 border-green-300 font-bold text-green-700 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
              USCITI: {drawnNumbers.length}
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Pannello Sinistro: Controller */}
        <div className="md:w-1/3 lg:w-[350px] p-4 flex flex-col items-center justify-center gap-6 z-10 shrink-0 bg-white/50 md:bg-white border-b-[3px] md:border-b-0 md:border-r-[3px] border-black shadow-lg overflow-y-auto">
          
          {/* Cerchio Numero Gigante */}
          <div className="relative group perspective-1000 w-full flex flex-col items-center">
             <span className="text-xl font-black text-slate-400 uppercase tracking-widest mb-4">Numero Estratto</span>
             
             <div className={`
               relative w-56 h-56 rounded-full flex items-center justify-center border-[6px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] transition-all duration-500
               ${currentNumber 
                 ? 'bg-gradient-to-br from-yellow-300 to-orange-400 scale-100 rotate-0' 
                 : 'bg-slate-100 scale-95 opacity-80'}
             `}>
                {/* Shine effect */}
                <div className="absolute top-8 right-10 w-12 h-8 bg-white/40 rounded-full rotate-[-45deg] blur-sm" />
                
                <span className={`text-[9rem] font-black text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,0.4)] leading-none ${currentNumber ? 'animate-pop' : ''}`}>
                  {currentNumber || '?'}
                </span>
             </div>

             {/* Nome File */}
             <div className="mt-6 w-full text-center px-2 h-16">
                {currentFile ? (
                   <div className="bg-white border-2 border-black p-2 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pop">
                      <p className="text-lg font-bold text-slate-800 truncate">{currentFile.name}</p>
                      {isPlaying && <p className="text-xs font-black text-green-500 uppercase mt-1 animate-pulse">🔊 In Riproduzione...</p>}
                   </div>
                ) : (
                  <p className="text-slate-400 font-bold italic">Premi il tasto per iniziare!</p>
                )}
             </div>
          </div>

          {/* Bottoni Azione */}
          <div className="w-full space-y-4 max-w-xs">
            <Button 
              size="xl" 
              fullWidth 
              onClick={handleDrawNumber}
              disabled={isPlaying || isGameOver}
              className="transform transition-transform"
            >
              <div className="flex items-center gap-3">
                {isGameOver ? (
                  <span>FINITO! 🎉</span>
                ) : (
                  <>
                    <Play className="w-8 h-8 fill-current stroke-[3]" />
                    <span>ESTRAI!</span>
                  </>
                )}
              </div>
            </Button>

            <Button 
              variant="secondary" 
              size="lg"
              fullWidth 
              onClick={() => currentNumber && playAudio(currentNumber)}
              disabled={!currentNumber || isPlaying}
              className="border-2 border-black"
            >
              <Volume2 className="w-6 h-6 mr-2" />
              Riascolta
            </Button>

            <div className="pt-4 mt-2 border-t-2 border-dashed border-slate-300 w-full flex flex-col gap-2">
               <Button variant="ghost" size="sm" onClick={handleRestartGame} className="text-slate-500 hover:text-black">
                 <RefreshCw className="w-4 h-4 mr-2" /> Nuova Partita
               </Button>
               <Button variant="ghost" size="sm" onClick={onResetApp} className="text-red-400 hover:text-red-600">
                 Esci dal gioco
               </Button>
            </div>
          </div>
        </div>

        {/* Pannello Destro: Tabellone */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scroll bg-sky-100/50">
          <div className="bg-white/80 backdrop-blur rounded-3xl border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
             <div className={`grid ${getGridCols()} gap-3 sm:gap-4 content-start`}>
                {files.map((file) => {
                  const isDrawn = drawnNumbers.includes(file.id);
                  const isCurrent = currentNumber === file.id;

                  return (
                    <div
                      key={file.id}
                      className={`
                        aspect-square flex items-center justify-center rounded-full font-black text-xl sm:text-2xl transition-all duration-500 relative
                        ${isCurrent 
                          ? 'bg-yellow-400 text-black scale-125 z-10 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pop' 
                          : isDrawn 
                            ? 'bg-green-400 text-white border-4 border-green-600 shadow-inner scale-95 opacity-80' 
                            : 'bg-white text-slate-300 border-[3px] border-slate-200'}
                      `}
                    >
                      {/* Shine for Bingo Ball effect */}
                      {!isDrawn && !isCurrent && <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full opacity-50" />}
                      {isCurrent && <div className="absolute top-2 right-3 w-3 h-2 bg-white rounded-full opacity-60 rotate-[-45deg]" />}
                      
                      {file.id}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};