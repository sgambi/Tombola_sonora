export interface AudioFile {
  id: number; // 1-based index for the board
  file: File;
  url: string; // Blob URL for playback
  name: string;
}

export type GameState = 'upload' | 'playing';

export interface GameStats {
  totalFiles: number;
  drawnCount: number;
  remainingCount: number;
}