import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' impostato su './' permette all'app di funzionare in qualsiasi sottocartella
  // risolvendo i problemi di caricamento (pagina bianca) su GitHub Pages.
  base: './',
});