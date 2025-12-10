import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // Imposta la base path per GitHub Pages corrispondente al nome della repository
    base: './',
});