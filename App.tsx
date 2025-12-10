import React, { useState, useEffect } from 'react';
import { UploadSection } from './components/UploadSection';
import { GameSection } from './components/GameSection';
import { AudioFile, GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>('upload');
  const [files, setFiles] = useState<AudioFile[]>([]);

  // Cleanup object URLs when component unmounts or files are cleared
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Prevent accidental page close/refresh if files are loaded
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (files.length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [files.length]);

  const handleFilesAdded = (newFiles: File[]) => {
    const maxFiles = 90;
    const remainingSlots = maxFiles - files.length;
    
    if (remainingSlots <= 0) return;

    const filesToAdd = newFiles.slice(0, remainingSlots);
    
    const newAudioFiles: AudioFile[] = filesToAdd.map((file, index) => ({
      id: files.length + index + 1,
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setFiles(prev => [...prev, ...newAudioFiles]);
  };

  const handleRemoveFile = (idToRemove: number) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === idToRemove);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      
      const filtered = prev.filter(f => f.id !== idToRemove);
      // Re-index remaining files to ensure IDs are sequential 1..N
      return filtered.map((f, index) => ({ ...f, id: index + 1 }));
    });
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (direction === 'up' && index > 0) {
        // Swap with previous
        [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
      } else if (direction === 'down' && index < newFiles.length - 1) {
        // Swap with next
        [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
      }
      
      // Re-index IDs to match new positions
      return newFiles.map((f, i) => ({ ...f, id: i + 1 }));
    });
  };

  const handleStartGame = () => {
    if (files.length > 0) {
      setGameState('playing');
    }
  };

  const handleResetApp = () => {
    setTimeout(() => {
        if (window.confirm("Sei sicuro? Questo cancellerà tutti i file caricati.")) {
            files.forEach(file => URL.revokeObjectURL(file.url));
            setFiles([]);
            setGameState('upload');
        }
    }, 10);
  };

  return (
    <div className="h-full w-full font-sans overflow-hidden">
      {gameState === 'upload' ? (
        <UploadSection
          files={files}
          onFilesAdded={handleFilesAdded}
          onRemoveFile={handleRemoveFile}
          onMoveFile={handleMoveFile}
          onStartGame={handleStartGame}
          onClearAll={handleResetApp}
        />
      ) : (
        <GameSection
          files={files}
          onResetApp={handleResetApp}
        />
      )}
    </div>
  );
}

export default App;