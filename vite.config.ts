import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Isso garante que os caminhos relativos serão tratados corretamente em produção
  plugins: [react(), tailwindcss()],
});