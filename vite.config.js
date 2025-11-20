import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/Pagina-de-compras/',
  plugins: [react()],
});
